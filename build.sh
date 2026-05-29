#!/bin/bash
set -e
cd "$(dirname "$0")"

case "$(uname -s)" in
  Darwin) PLATFORM=darwin ;;
  Linux) PLATFORM=linux ;;
  *)
    echo "Unsupported OS: $(uname -s)" >&2
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64|amd64) CPU=x64 ;;
  arm64|aarch64) CPU=arm64 ;;
  *)
    echo "Unsupported architecture: $(uname -m)" >&2
    exit 1
    ;;
esac

ESB_VERSION="0.25.0"
ESB_PKG="@esbuild/${PLATFORM}-${CPU}"
ESB_TARBALL="${PLATFORM}-${CPU}-${ESB_VERSION}.tgz"
ESB_BIN=".tools/package/bin/esbuild"
ESB_MARKER=".tools/esbuild-platform"
WANTED="${PLATFORM}-${CPU}"

if [ ! -f "$ESB_BIN" ] || [ "$(cat "$ESB_MARKER" 2>/dev/null)" != "$WANTED" ]; then
  rm -rf .tools/package .tools/esbuild.tgz
  mkdir -p .tools
  curl -fsSL "https://registry.npmjs.org/${ESB_PKG}/-/${ESB_TARBALL}" -o .tools/esbuild.tgz
  tar -xzf .tools/esbuild.tgz -C .tools
  echo "$WANTED" > "$ESB_MARKER"
fi

install_pkg() {
  local name=$1
  local pkg=$2
  local ver=$3
  if [ ! -d "node_modules/${pkg}" ]; then
    curl -fsSL "https://registry.npmjs.org/${pkg}/-/${name}-${ver}.tgz" -o /tmp/pkg.tgz
    mkdir -p "node_modules/${pkg}"
    tar -xzf /tmp/pkg.tgz -C "node_modules/${pkg}" --strip-components=1
  fi
}

install_pkg react react 18.3.1
install_pkg react-dom react-dom 18.3.1
install_pkg scheduler scheduler 0.23.2
install_pkg zustand zustand 5.0.2
install_pkg lucide-react lucide-react 0.468.0

mkdir -p dist
.tools/package/bin/esbuild src/main.jsx \
  --bundle \
  --outfile=dist/bundle.js \
  --loader:.jsx=jsx \
  --jsx=automatic \
  --format=iife \
  --minify \
  --target=es2020

echo "Build complete: dist/bundle.js"
