## Requirements
- Node 16.x

## Library

<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is an AWS Lambda boilerplate to get you up and running quickly.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [![Node][Node.js]][Node-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Serverless Framework][Serverless]][Serverless-url]

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
Make sure you have Node 16 and serverless framework installed:
- https://nodejs.org/en/download/
- https://www.typescriptlang.org/download

### Installation

Clone the repository and place it in: source/serverless
* git
  ```sh
  git clone git@bitbucket.org:MonkEdwin/aws-lambda-node.git
  ```

Within source/serverless run:
* npm
  ```sh
  npm install
  ```


<!-- USAGE EXAMPLES -->
## Usage

The skeleton come with some handy functionality.

### Response

#### Example
```typescript
import HttpStatusCode from '../lib/http/code';
import Response from '../lib/http//response';

const response = new Response();

return response
    .status(HttpStatusCode.OK)
    .with({foo: 'bar'}) // Will be wrapped in a data attribute: { data: { foo: 'bar' } }
    .addHeader('Cache-Control', 'public, max-age=300')
    .send();
```

<p align="right">(<a href="#top">back to top</a>)</p>

### Encryption
Required environment variables:
- HEX_ENCRYPTION_KEY

#### Example
```typescript
import { encrypt, decrypt } from '../lib/crypto';

const encrypted = encrypt('foo');
const decrypted = decrypt(encrypted);

```

<p align="right">(<a href="#top">back to top</a>)</p>

### Hashing
Required environment variables:
- HASHING_KEY

#### Example
```typescript
import { hash, equals } from '../lib/hash';

const hashed = hash('foo');
const test = 'hashed string';

// contant-time hash comparison
if (equals(hashed, test)) {
    console.log('equal');
} else {
    console.log('not equal');
}

<p align="right">(<a href="#top">back to top</a>)</p>

```
### S3 Signed Upload Url
Required environment variables:
- AWS_REGION
- S3_BUCKET

#### Example

```typescript
import { S3 } from 'aws-sdk';
import { Ext, signedUploadUrl, Size } from '../lib/signed-upload-url';

const s3 = new S3({region: process.env.AWS_REGION});
const key = `social/${uuid}.${Ext.JPG}`;
const expiration = 500;

// Based on the key extension it sets the starts-with condition.
const url = await signedUploadUrl(s3, key, expiration, Size.ONE_MB);
console.log(url);
```

<p align="right">(<a href="#top">back to top</a>)</p>

### Media

### Images
Optional environment variables:
- IMAGICK_PATH (required when using lambda)

#### Example

```typescript
import { imageProbe } from '../lib/media/image';

// ImageInfo:
// {
//    size: 184817, // bytes
//    format: 'PNG',
//    extension: 'png',
//    width: 344, // pixels
//    height: 294, // pixels
// }

try {
    const info = await imageProbe('path to image.jpg');
    console.log(info);
} catch (e) {
    console.error('invalid image');
}
```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [ ] TBD

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Node.js]: https://img.shields.io/badge/Node-35495E?style=for-the-badge&logo=node.js&logoColor=4FC08D
[Node-url]: https://nodejs.org
[Typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/docs/
[Serverless]: https://img.shields.io/badge/Serverless-35495E?style=for-the-badge&logo=serverless&logoColor=orange
[Serverless-url]: https://www.serverless.com/framework/docs
