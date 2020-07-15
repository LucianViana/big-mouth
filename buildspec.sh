version 2.0
phases:
  build:
    commands:
      - ./build.sh int-test
      - ./build.sh deploy dev
      - ./build.sh acceptance-test
