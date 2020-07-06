# AWS Lambda with Node, Typescript and Serverless

## Requirements
Make sure you have below tools installed and configured:  
[Node 12.x](https://nodejs.org/docs/latest-v12.x/api/)  
[Typescript](https://www.typescriptlang.org/)  
[Serverless](https://www.serverless.com)  
[AWS CLI](https://aws.amazon.com/cli/)  

*To manage node versions on your machine, use: https://github.com/nvm-sh/nvm  
  
## Usage
- run: ```yarn``` to install all dependencies.  
- The ```src``` folder contains your code.  

## Configuration
Before deploying you need to set some configuration values.
These can be set via env variables, .env is supported.  
Rename .env.dist to .env and set the values.  
```
stage: ${env:STAGE} // Default is dev
project: ${env:PROJECT}
```