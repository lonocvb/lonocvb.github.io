#!/bin/bash

get_src() {
  echo $1 | sed 's/.*src="\([^"]*\)".*/\1/g'
}

browserify_script_entry () {
  file="$(basename "$1")"
  rdir="$(dirname "$1")"
  dir="$(realpath "$rdir")"
  OUT="$2"
  WORKDIR="$3"

  mapfile -t lines < <(grep -o '<script .*\(type="module"\)\?.*>' $dir/$file)

  for i in "${lines[@]}"
  do
    src_with_query="$(get_src "$i")"

    src="${src_with_query%\?*}"
    query=""
    if [[ ! $src == $src_with_query ]]; then
      query="?${src_with_query##*\?}"
    fi

    if [[ ! -e "$dir/$src" ]]; then
      continue
    fi

    src_out="${src%.*}.bundle.js"
    path_html_out="$OUT/$rdir/$file"
    path_src_out="$(realpath "$OUT/$rdir/$src_out")"

    # compile X.js to X.bundle.js
    cd "$WORKDIR"

    if [[ ! -d ./node_modules ]]; then
      npm i
    fi

    npx browserify \
      -r @babel/runtime/helpers/asyncToGenerator \
      -r @babel/runtime/helpers/createClass \
      -r @babel/runtime/helpers/classCallCheck \
      -r @babel/runtime/helpers/defineProperty \
      -r @babel/runtime/helpers/getPrototypeOf \
      -r @babel/runtime/helpers/inherits \
      -r @babel/runtime/helpers/interopRequireDefault \
      -r @babel/runtime/helpers/possibleConstructorReturn \
      -r @babel/runtime/helpers/slicedToArray \
      -r @babel/runtime/helpers/toConsumableArray \
      -r @babel/runtime/helpers/typeof \
      -r @babel/runtime/regenerator \
      "$dir/$src" -o "$path_src_out" \
      -t [ babelify \
       --presets [ @babel/preset-env ] \
       --plugins [ @babel/transform-runtime @babel/plugin-proposal-object-rest-spread ] \
      ] \
    && echo "browserify: $path_src_out"  \
    || echo "fail browserify: $path_src_out"

    cd - > /dev/null 2>&1

    # replace X.js to X.bundle.js
    sed -i "s|$i|<script src=\"$src_out$query\"></script>|g" "$path_html_out"

  done
}

main() {
  currDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

  TOP="$(realpath "$currDir/..")"
  SRC="$TOP/app"
  OUT="$TOP/app_es5"
  WORKDIR="$currDir/node_tool"

  # Workspace to $SRC, so we can get the relative path from $SRC and generator the same folder structure to $OUT easily.
  cd $SRC

  # copy non JS files.
  rsync -av --exclude='*.js' $SRC/ $OUT

  # search and compile the JS files used in *.html, <script src="..."></script>.
  mapfile -t htmls < <(find . -name \*.html)
  for i in "${htmls[@]}"
  do
    browserify_script_entry $i $OUT $WORKDIR
  done

  # wait for pids
  pids=$(jobs -p)
  wait $pids
}

main "$@"
