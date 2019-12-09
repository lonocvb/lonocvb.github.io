#!/bin/bash

set -e

currDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TOP="$(realpath $currDir/..)"

dockerName="git.kaiostech.com:4567/edge-service/morpheus/ar-tour:$(git log -n1 --format="%h")"
dockerLatest="git.kaiostech.com:4567/edge-service/morpheus/ar-tour:latest"

main() {
  cd $TOP

  npx ng build --prod
  docker build -t $dockerName .
  docker push $dockerName

  docker tag $dockerName $dockerLatest
  docker push $dockerLatest
}

main "$@"
