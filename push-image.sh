#!/bin/bash

set -e

IMAGE_NAME=easy-ddns
VERSION=0.0.1
REMOTE_REPO=fevernova90
COMMIT_SHORT_HASH=$(git log -1 --pretty=%h)

# Build
# docker build \
#   --target production \
#   -t $REMOTE_REPO/$IMAGE_NAME:$VERSION \
#   -t $REMOTE_REPO/$IMAGE_NAME:$COMMIT_SHORT_HASH \
#   -t $REMOTE_REPO/$IMAGE_NAME:latest \
#   --build-arg NODE_ENV=$TAG .

# Multi-arch build
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  --target production \
  -t $REMOTE_REPO/$IMAGE_NAME:$VERSION \
  -t $REMOTE_REPO/$IMAGE_NAME:$COMMIT_SHORT_HASH \
  -t $REMOTE_REPO/$IMAGE_NAME:latest \
  --build-arg NODE_ENV=$TAG --push .

# Push
# docker push $REMOTE_REPO/$IMAGE_NAME:$COMMIT_SHORT_HASH
# docker push $REMOTE_REPO/$IMAGE_NAME:$VERSION
# docker push $REMOTE_REPO/$IMAGE_NAME:latest
