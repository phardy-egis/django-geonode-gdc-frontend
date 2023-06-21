# Changelog

## [1.4.0](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.3.2...v1.4.0) (2023-06-21)


### Features

* added layer loading ([1424954](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/1424954d3af11f59f2d64e7a8983a88185d7cd67))
* added paginated result handler for result list ([dd5847b](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/dd5847bfad2909f69cd3c63d2fa6054a6dc71610))
* added partial loading of layers on map ([7940c35](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/7940c351bd8689fd0b7de8758f6c0b9a2f697b5a))
* added region filtering ([f9acaa9](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/f9acaa962400dcb08be0c020f0e0b1f971d47110))
* authentication enabled on startup ([f86dba0](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/f86dba01bdd6a90d059157431283b2e220360fb8))
* bbox filter ([3d12cc3](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/3d12cc3b7d1e31e643a8bb816878a931b80eab2d))
* BBOX is loaded when the resultItem is added to the map ([67d8143](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/67d81434b9efaf329e4ba43a57d6a5884877071b))
* category filter ([b3a9e72](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/b3a9e72f49df07371da2a8da858c4f20bfc03e81))
* cluster centroids filtered on map update ([12faef5](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/12faef579b9cd6a6284db0c4971a96394c101851))
* date filter ([b3a9e72](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/b3a9e72f49df07371da2a8da858c4f20bfc03e81))
* fade animation for main components ([a416751](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/a4167514f20a965c088db13f62f0de9749d52085))
* GeoJSON bboxes displayed ([0f35926](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/0f3592628cf623c7d0d4e02acf21a07e78956932))
* **GeonodeWMSLayer:** added support to custom links ([79a1643](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/79a16436d1d45a5f56b603e5292859694ccbfae5))
* implemented dynamic loading for c categories ([2be7934](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/2be7934e1d263f74ea70de6109e3013da795cdd7))
* implemented fetch wrapper ([f5e7150](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/f5e71507b149230b3463aab68492648407b604e3))
* layer centroids operationnal ([4b86bbe](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/4b86bbe10a9d4fdd6955b7b5ee7219ff56c6fe5b))
* LegendItem opacity handler linked to REDUX store ([67d8143](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/67d81434b9efaf329e4ba43a57d6a5884877071b))
* LegendItem visibility handler linked to REDUX store ([67d8143](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/67d81434b9efaf329e4ba43a57d6a5884877071b))
* opacity change now linked to the right layer ([e3a65a1](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/e3a65a1133fb3cc9cd4913d5ebde327cce85bb49))
* optimization on map layer rendering to make display smoother ([0809da8](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/0809da837cdfedfc996047ec400c01e0bcc2f74e))
* preloader progress bar ([1def40a](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/1def40af076a3cbde1b5489a0f9e79473bf506df))
* **redux:** implemented shallowEqual for costing operations on map ([47be309](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/47be3096e0338d97ac61eb711c1e844b9c37d974))
* zoom onto layer at loading ([248685a](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/248685a5a3bc11af4d844affe0824aef20942d08))
* zoom to layer feature now available ([3a41cbf](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/3a41cbfefd8704b711a763a249f75d884be36fca))


### Bug Fixes

* avoid legend rerendering each time event is dispatched to the store ([c4ca24c](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/c4ca24c3158a87e6552a070370e257d2e602f302))
* bugs added because of code refactoring ([211c0d9](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/211c0d9e50eacfd4c5cb3c48ef511799d7ff7ac5))
* categories filtering ([d4f00d2](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/d4f00d2a7c8d08b660e3a421a62b3beecfacbcac))
* css rules for categories filters ([a416751](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/a4167514f20a965c088db13f62f0de9749d52085))
* debounced search change event ([b3a9e72](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/b3a9e72f49df07371da2a8da858c4f20bfc03e81))
* deps errors ([3402c78](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/3402c78d49455f2fd556dd8ff055265db869b256))
* **GeonodeWMSLayer:** refference to layer alternate title ([5985975](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/5985975564f006ef0ad345a6eb723b16e659f899))
* **GeonodeWMSLayer:** refference to WMS data ([ccbf7e5](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/ccbf7e5084dc1c339a435525ccf60a178a689bf2))
* **GeonodeWMSLayer:** URL wrong args ([e0ca183](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/e0ca1835ed2e0747da71a75865924ad386e90fbe))
* legend is now linked to redux data store ([946f4fa](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/946f4faa3c4b4f5e8d057c873fc01713d594d7b8))
* **LegendItem:** fixed ResultItem to get it working ([3983ffd](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/3983ffd41c29d770c5731b9a0b1d1c6740e6afa7))
* **Legend:** legend not re-rendered each time LegendItem properties are changed ([ac369fc](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/ac369fcfb216d4dc942828f19c503986c93504ab))
* only one laoding control is displayed ([eadc698](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/eadc698ef32e07b450bc8c1654fe3ce7aeaf072e))
* region filter is disabled when map extent is enabled ([24417fb](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/24417fb04ae63fad87a58072821787f4314c9d46))
* removed unused console.log ([28e6c46](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/28e6c46fd3ed1b9b6a97fe7519569fee0fca79fa))
* **searchPanel:** category filter not working ([6fcf809](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/6fcf809ff3d0b2387ad777342903f22152380370))
* **URL:** using proper layer title ([5c134dc](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/5c134dcb43e9aa10fbc936ede91bd75ba6ef0613))

## [1.3.2](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.3.1...v1.3.2) (2023-06-06)


### Bug Fixes

* added debounce and invalidate size on map ([bc01d4f](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/bc01d4f96a36fdd93dc2760a3b445bd914c98041))
* bbox polygon loading for LegendItems ([55d97c3](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/55d97c35aa9735cfffb4ed7bf7686eab66d80c92))
* localchanges ([8ed3f4b](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/8ed3f4bf9b76f2594f1288886912cf33ec633ead))
* map size invalidation not working (reverted to old settings) ([55d97c3](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/55d97c35aa9735cfffb4ed7bf7686eab66d80c92))
* removal of geonode deprecated endpoints ([55d97c3](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/55d97c35aa9735cfffb4ed7bf7686eab66d80c92))
* removal of prop code ([1e01046](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/1e010468959bb9c94184e844eda1c07a84f0de29))

## [1.3.1](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.3.0...v1.3.1) (2023-05-31)


### Bug Fixes

* esri layers not hiding anymore geonode layer ([ff5f2a7](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/ff5f2a70efced4b4fa726f27f1af6daaf4031d42))

## [1.3.0](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.2.1...v1.3.0) (2022-10-28)


### Features

* **esri-leaflet:** added esri-leaflet backgrounds ([c76dd6c](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/c76dd6c99cd79a005fd1e382dfe78ca6c2ffd38b))


### Bug Fixes

* **html:** minor fix in html of the main layout ([1e0204e](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/1e0204eab53e4bfd88aca9f51b0c38470c9dae62))
* **layer-switcher:** optimization of layer switcher ([92b4bc1](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/92b4bc164461b142dd621a6d035c75daa4d93d40))
* **media:** optimized media for compilation ([c0768c1](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/c0768c151121cd9390c995acf48dc8b28af9117d))

## [1.2.1](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.2.0...v1.2.1) (2022-10-21)


### Bug Fixes

* **assets:** minified image size ([42f1922](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/42f1922179850ac9746aff975b62be28065fdeaa))
* **env:** added env variable allowig hot restart of CRA during dev ([9b47a75](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/9b47a755cbbecfc0dd8b952719fd11440a96db91))

## [1.2.0](https://github.com/phardy-egis/django-geonode-gdc-frontend/compare/v1.1.1...v1.2.0) (2022-10-19)


### Features

* added the possibliity of setting the site url from the .env file ([0ecfc5d](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/0ecfc5d598ea5f1911b412c010e870ad957ef8e3))


### Bug Fixes

* **env:** added the possiblity of changing the domain name depending on the .env file ([4b69d0b](https://github.com/phardy-egis/django-geonode-gdc-frontend/commit/4b69d0bd4b7f737aff09893f51878fa8b56650f3))

## [1.1.1](https://github.com/Inogeo/gdc-frontend/compare/v1.1.0...v1.1.1) (2022-09-21)


### Bug Fixes

* added screenshot on the main page ([8e85eab](https://github.com/Inogeo/gdc-frontend/commit/8e85eab7fd2941ef1b5370c88abe7d0c89f23031))
* minor fix in html ([d02eaef](https://github.com/Inogeo/gdc-frontend/commit/d02eaefd7fb2cee1e769f789f332f351edb1b2fa))

## [1.1.0](https://github.com/Inogeo/gdc-frontend/compare/v1.0.0...v1.1.0) (2022-09-21)


### Features

* changed LICENCE to be compatible with geonode contrib app ([d012599](https://github.com/Inogeo/gdc-frontend/commit/d012599a151d27106dfeb71b9e91209c57b2cbc8))

## 1.0.0 (2022-09-20)


### Features

* added release please workflow ([66be68b](https://github.com/Inogeo/gdc-frontend/commit/66be68b0319b2d4f57c1120e004adb457b661693))
* **docker-compose:** added CRA client ([01fb02c](https://github.com/Inogeo/gdc-frontend/commit/01fb02c43d196bb9111cd815ab2eab5fdc095e03))
* initial commit ([d949414](https://github.com/Inogeo/gdc-frontend/commit/d949414b6211731cc3173c7bb1db44c257925398))


### Bug Fixes

* added  WATCHPACK_POLLING .env var for CRA hot reload support in windows ([b57ed81](https://github.com/Inogeo/gdc-frontend/commit/b57ed81598ec3854dee97518d153966f8a1c5d00))
* layer switcher images added in dependencies ([ca277a0](https://github.com/Inogeo/gdc-frontend/commit/ca277a023e31a421cbbcb9609d052e456608a5b9))
* react start command ([7c70d9c](https://github.com/Inogeo/gdc-frontend/commit/7c70d9c1db894345c8e53b95682e97b933bd4b7d))
* Remove bad release please file ([c81f3c8](https://github.com/Inogeo/gdc-frontend/commit/c81f3c82ec4709dfd5f3ef3d1422dea7232d1166))
* rename release please config workflow ([fd1d878](https://github.com/Inogeo/gdc-frontend/commit/fd1d878ebf04f6bdf84b49286b2d384a8ba031b2))
