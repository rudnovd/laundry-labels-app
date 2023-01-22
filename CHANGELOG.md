# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.0.0-alpha.3](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.2...v0.0.0-alpha.3) (2023-01-22)


### Features

* **components:** add EditItemPage component ([1797986](https://github.com/rudnovd/laundry-labels-app/commit/1797986ef1fd801a695e16a9842d8570c19e91bf))
* **components:** add LaundryIconsGroup component ([3053805](https://github.com/rudnovd/laundry-labels-app/commit/3053805235e903672b33640616afcd2953144e70))
* **components:** add SelectItemTags component ([58d9d03](https://github.com/rudnovd/laundry-labels-app/commit/58d9d03cbb245a3b3e10d014b56f5a12511a37f7))
* **components:** add UploadItemImage component ([cbb7733](https://github.com/rudnovd/laundry-labels-app/commit/cbb77330e0ee1aad4f03cd02183518698ef5b546))
* **components:** update CreateItemPage component ([5303b7d](https://github.com/rudnovd/laundry-labels-app/commit/5303b7d93697b96bf79ceb6a3f2689f22aad57e1))
* **interfaces:** add name to Item interface ([5d7c267](https://github.com/rudnovd/laundry-labels-app/commit/5d7c26755f2594ffe0780c559f234d4c3e8a0e47))
* **ItemPage:** add name field to Item page ([6d1ddb7](https://github.com/rudnovd/laundry-labels-app/commit/6d1ddb77590af5900b2a8613aa4f79f165e2409b))
* **LaundryIconsGroup:** add value prop ([0805393](https://github.com/rudnovd/laundry-labels-app/commit/0805393e50f0081a32e5ac4d746619ed6ccc4b91))
* **router:** update router functions ([da2e3e9](https://github.com/rudnovd/laundry-labels-app/commit/da2e3e95fc3d164e0a804ac4ea9f62616313f267))
* **services:** add jwt module ([db4c05f](https://github.com/rudnovd/laundry-labels-app/commit/db4c05f1996d082f1dab081efb8f4293a4e422ec))
* **store:** add new function in user store ([c5f44a8](https://github.com/rudnovd/laundry-labels-app/commit/c5f44a84b7c3cf7beaaf253669ee6fe306941587))


### Bug Fixes

* **interfaces:** remove isDisabled from User interface ([af5e45b](https://github.com/rudnovd/laundry-labels-app/commit/af5e45b3cd20b3d5b2a092f09ddd753eb81f5119))
* **request:** fix Unauthorized error number ([5d2f77e](https://github.com/rudnovd/laundry-labels-app/commit/5d2f77eef9b494f53a11d887d720eeea7fc84328))
* **types:** fix Hcaptcha types ([d648c69](https://github.com/rudnovd/laundry-labels-app/commit/d648c694222c3d12e4eaa7f064932c45527b20ae))

## [0.0.0-alpha.2](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.1...v0.0.0-alpha.2) (2022-06-22)


### Features

* add delay for loading plugin ([1e8f8bd](https://github.com/rudnovd/laundry-labels-app/commit/1e8f8bd856eb4982410727921ec294f169f4adca))
* add service worker registration ([efdf2d3](https://github.com/rudnovd/laundry-labels-app/commit/efdf2d3be665011fdf6fd11fe0b7d7e3dea9f9d0))
* **CreateItemPage:** write offline images in db ([08df663](https://github.com/rudnovd/laundry-labels-app/commit/08df663e53ed55bdd516039aae2881dfc75d1881))
* **db:** add itemsImages table ([5ee5a85](https://github.com/rudnovd/laundry-labels-app/commit/5ee5a85815f01ba799e083909fac08b4ad4b5e60))
* **HomePage:** add disabled for new item button ([019dd1d](https://github.com/rudnovd/laundry-labels-app/commit/019dd1dcae4263aa990d881a6f7ab408b7114cb3))
* **HomePage:** add offline items ([1847d6f](https://github.com/rudnovd/laundry-labels-app/commit/1847d6f9a6d6fd2c8732541a17500780334253f7))
* **HomePage:** revoke objects urls on unmount ([11afdac](https://github.com/rudnovd/laundry-labels-app/commit/11afdac923f2e0df11f3f116bfc079310bfae292))
* init offline database ([72a90cf](https://github.com/rudnovd/laundry-labels-app/commit/72a90cfa2c9b511ae172dd0ff426e6ec0f850fb8))
* init service worker ([bef0fa3](https://github.com/rudnovd/laundry-labels-app/commit/bef0fa3e02a70db4d0d20b5d9d8434632eab5529))
* **interfaces:** add types for auth requests ([43e9fab](https://github.com/rudnovd/laundry-labels-app/commit/43e9fab5a2e1b539199db2caed915fafe59ead64))
* **ItemPage:** add button for save offline item ([23a476a](https://github.com/rudnovd/laundry-labels-app/commit/23a476a85448f82ebdbf9d4d5807e9309373f55b))
* **ItemPage:** upload image in syncItem function ([1ee6bae](https://github.com/rudnovd/laundry-labels-app/commit/1ee6bae03827645322547a9f20f2c35b19d1551b))
* migrate to Vite ([0e037b3](https://github.com/rudnovd/laundry-labels-app/commit/0e037b3abb5896de51e1ffd06f3d53dcc48087f2))
* **ProfilePage:** add offline; move buttons from welcome page ([0ee306b](https://github.com/rudnovd/laundry-labels-app/commit/0ee306befdd6387f13c958733cddf05b04968717))
* **request:** migrate from Axios to Ky ([677d366](https://github.com/rudnovd/laundry-labels-app/commit/677d366bce68bcec1855ee66d3c0ce3ed1b85f81))
* **router:** offline; tmp remove welcome route ([00b3249](https://github.com/rudnovd/laundry-labels-app/commit/00b324948444e38ac2fe0d3759356420faea6f89))
* **serviceworker:** cache all user images ([3007422](https://github.com/rudnovd/laundry-labels-app/commit/30074221603a37a9dda6c9c2ee839702c04b8dfe))
* **serviceworker:** cache cloudinary images ([be51e33](https://github.com/rudnovd/laundry-labels-app/commit/be51e33b5095d4e3c2e258eacc25eac6b8bcee43))
* **store:** delete offline images on deleteItem ([cbd2751](https://github.com/rudnovd/laundry-labels-app/commit/cbd2751eb5faa9a2f90913cbe3b2d31f58e58e4d))
* **store:** generate images url for offline items ([90281d7](https://github.com/rudnovd/laundry-labels-app/commit/90281d7cf812e4a012931b19e6065cf3113e48ff))
* **stote:** add offline access ([91b65d6](https://github.com/rudnovd/laundry-labels-app/commit/91b65d64ec432f1b51f4f9fc2f10012ef2b119a4))


### Bug Fixes

* **CreateItemPage:** fix icons styles ([f49f122](https://github.com/rudnovd/laundry-labels-app/commit/f49f122e15fad51c3b326a19afe06cbc5698dc96))
* **CreateItemPage:** fix image upload request ([a35edae](https://github.com/rudnovd/laundry-labels-app/commit/a35edaecff9152e54b195089c8c8cd6fffadd1e9))
* fix env names ([436f110](https://github.com/rudnovd/laundry-labels-app/commit/436f110257f9a08cb1e7287a0478718c9c876854))
* fix redirects if user logged in ([268aeb1](https://github.com/rudnovd/laundry-labels-app/commit/268aeb1117f38351c5dc783618f2fe66e4de45c0))
* **HomePage:** fix items loading state ([cce6939](https://github.com/rudnovd/laundry-labels-app/commit/cce69391052427bd48576e0c8f60471cfebd7c8b))
* **ItemPage:** fix syncItem when item w/o images ([ac2e35a](https://github.com/rudnovd/laundry-labels-app/commit/ac2e35ae65549093f2aac69fcfc24ba783f3463e))
* **request:** fix recursion error ([e4eb824](https://github.com/rudnovd/laundry-labels-app/commit/e4eb8245dcac7fa330cc4a27eda2a0cb2551557d))
* **request:** remove 500 status validation ignore ([2a611e3](https://github.com/rudnovd/laundry-labels-app/commit/2a611e3f2904dfeb4b66b64746d1c3de9b7964d4))
* **request:** remove always send auth token ([f2ccff9](https://github.com/rudnovd/laundry-labels-app/commit/f2ccff9517ee108f4882231f5a411676f3bd1980))
* **services:** fix request service errors ([3c308f7](https://github.com/rudnovd/laundry-labels-app/commit/3c308f79d7494bf4d69372ceaf7063a158ad4633))
* **SignUpPage:** fix captcha component state ([a85c95f](https://github.com/rudnovd/laundry-labels-app/commit/a85c95fa80ae44dfa041ffd8fc43f391562b85a7))
* **store:** fix Dexie error handling ([b538ee4](https://github.com/rudnovd/laundry-labels-app/commit/b538ee4e0dced927722a527ca2d70d7796f1ea80))
* **store:** fix postItem for offline ([de26cc0](https://github.com/rudnovd/laundry-labels-app/commit/de26cc0e78dbab3603c50c657f4b213c119bd7eb))
* **store:** throw another store error ([ee06a45](https://github.com/rudnovd/laundry-labels-app/commit/ee06a45926c3e25aa074e98a56f4a83d950f80d6))
* **store:** throw error in throwStoreError ([390a5a4](https://github.com/rudnovd/laundry-labels-app/commit/390a5a43400a82d4ccefeec8de7d67b27fc8b713))
* **sw:** fix sw register ([492904d](https://github.com/rudnovd/laundry-labels-app/commit/492904da2da9d479f8c82e1a5055058a077e98e6))
* **vite:** fix APP_VERSION define ([05f845a](https://github.com/rudnovd/laundry-labels-app/commit/05f845acff54515beebe6e7ae58ec06bafc0f52c))
* **vite:** fix APP_VERSION define ([4d3aa80](https://github.com/rudnovd/laundry-labels-app/commit/4d3aa809e75e407077ef4bc7da2b45036a5c0efa))

## [0.0.0-alpha.1](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.0...v0.0.0-alpha.1) (2021-12-05)

## 0.0.0-alpha.0 (2021-11-30)


### Features

* add some css for desktop resolution ([7148a68](https://github.com/rudnovd/laundry-labels-app/commit/7148a680ec08d6fa5d8bfa51892083d11a63b85b))
* **app:** add 'back' button ([f5f9546](https://github.com/rudnovd/laundry-labels-app/commit/f5f95460253f1aeae787a4c3e8be735acaa455b5))
* **assets:** add new icons in laundryIcons array ([2d99b5f](https://github.com/rudnovd/laundry-labels-app/commit/2d99b5fe9cef35a56fea43def6144dc2400f77a9))
* **components:** add LaundryCardSkeleton component ([4120837](https://github.com/rudnovd/laundry-labels-app/commit/41208371c9fc93d2e24bffab4b7dcbd3d6fa5b9e))
* **components:** init project components ([6233663](https://github.com/rudnovd/laundry-labels-app/commit/623366338c1fd719dc0f36155cc9beaf6beb837c))
* **CreateItem:** add functions for create new item ([e44d92f](https://github.com/rudnovd/laundry-labels-app/commit/e44d92f9fc037df45bb575ad5b7e0bbf72fbea42))
* **CreateItemPage:** add new options for tags ([c156b0e](https://github.com/rudnovd/laundry-labels-app/commit/c156b0e4168a2800570b5f579bfb27adf783d634))
* **CreateItemPage:** move tags higher, capitalize groups names ([4054131](https://github.com/rudnovd/laundry-labels-app/commit/4054131727d307a7bcb20299d50e8ef350e9cef9))
* **env:** add VUE_APP_CAPTCHA_KEY ([4c18f50](https://github.com/rudnovd/laundry-labels-app/commit/4c18f502afd5e4e83edc4155edaf1ddc1625453f))
* **firebase:** add db collections enum ([4d05d21](https://github.com/rudnovd/laundry-labels-app/commit/4d05d2182eb6c7f49c0f443e4bc24d13e5f51aab))
* **Home:** replace circular to skeleton, fix styles and script ([99e9404](https://github.com/rudnovd/laundry-labels-app/commit/99e94048bbd69efff1ebbc3dfba07dc13219ac6f))
* **icons:** add test wash icons ([9ea4d41](https://github.com/rudnovd/laundry-labels-app/commit/9ea4d412dabed47d0e44b621b0cc472407d1186a))
* **icons:** init laundry icons ([990fe9f](https://github.com/rudnovd/laundry-labels-app/commit/990fe9f21825a0c629cda35cf343c43a2a58a70b))
* include service worker in main.ts, add install button ([5458af3](https://github.com/rudnovd/laundry-labels-app/commit/5458af3f23f6ab2fe520f8524431cb1eb35c2dbb))
* init firebase ([8b92a01](https://github.com/rudnovd/laundry-labels-app/commit/8b92a01f31bdfad8c755abd1904b9d0d2878af70))
* init quasar ([6affa22](https://github.com/rudnovd/laundry-labels-app/commit/6affa22a9ce8c218668e0003fc67f3a248c7fb35))
* init service worker ([5ea581c](https://github.com/rudnovd/laundry-labels-app/commit/5ea581c0aa0db6a1411fc04053bb37c1082eb978))
* **interfaces:** add userItemBlank interface ([6c65923](https://github.com/rudnovd/laundry-labels-app/commit/6c65923d8fc687b5d2e1ce2161a410ff1dc561b3))
* **interfaces:** init project models ([f33d56f](https://github.com/rudnovd/laundry-labels-app/commit/f33d56fdc93221bed94d51ff07f8c1950ec79bbb))
* **interfaces:** update type field in userItem interface ([6221a36](https://github.com/rudnovd/laundry-labels-app/commit/6221a36675db9d494f9badd813df8c1fdc352b82))
* **Item:** add info about item and 'edit' and 'delete' buttons ([2e1ebd3](https://github.com/rudnovd/laundry-labels-app/commit/2e1ebd39737e46b2a6e1e859cc02b995b5000d46))
* **LaundryCard:** add styles for items without images ([ea2cd24](https://github.com/rudnovd/laundry-labels-app/commit/ea2cd24d18e4eb9278cfe3ab994adc1402829686))
* **quasar:** add notify plugin, add quasar variables in sass additionalData ([1c7a621](https://github.com/rudnovd/laundry-labels-app/commit/1c7a62114629f2364c323bde388c5ea1a9f254ef))
* **router:** add new routes, add router guards ([61dfc85](https://github.com/rudnovd/laundry-labels-app/commit/61dfc858aa955964d28710c72773f8cfb80aa31b))
* **store:** add new actions for items and laundry labels options ([77afb1a](https://github.com/rudnovd/laundry-labels-app/commit/77afb1aededf8cb87ee34336b5a00758d2d2078c))
* **store:** add persistance; item type filtering; remove nanoid ([9f2706f](https://github.com/rudnovd/laundry-labels-app/commit/9f2706f562b092af25c3106510a695bb551cb8bf))
* **store:** add user and user items store ([d1ed58d](https://github.com/rudnovd/laundry-labels-app/commit/d1ed58dfaad36c3a2c3a910213930c03a90b3491))
* **store:** migrate from Vuex to Pinia ([e7bc968](https://github.com/rudnovd/laundry-labels-app/commit/e7bc968ddbf4ad0ff81bce540131045cb3561d0c))
* **styles:** update styles ([5927d55](https://github.com/rudnovd/laundry-labels-app/commit/5927d55307b79f46f2da4bb7a3845d83a3ab8505))
* **views:** add 'Not found' page ([0b42f33](https://github.com/rudnovd/laundry-labels-app/commit/0b42f3375679dae89a3e6ec94d0dca8b1ba3862d))
* **views:** add app version in Profile page ([0710a7f](https://github.com/rudnovd/laundry-labels-app/commit/0710a7f86d9a11e5a3c7c51405598fa85fcf03eb))
* **views:** add category filter in 'Home' page ([1688929](https://github.com/rudnovd/laundry-labels-app/commit/1688929984cec3ed4daf299aa2783327ff81bb2e))
* **views:** add edit item page ([7565d5b](https://github.com/rudnovd/laundry-labels-app/commit/7565d5b52efc4626338e85110fc97cf966a73923))
* **views:** add hCaptcha for LoginPage and RegistartionPage ([fa2eed0](https://github.com/rudnovd/laundry-labels-app/commit/fa2eed0a74361d9bbe4f432856dd6eb2b4a1dd5a))
* **views:** add image form in CreateItem component ([24b23e6](https://github.com/rudnovd/laundry-labels-app/commit/24b23e6366bf1ebeba3124426bf6b101477bc886))
* **views:** add infinite scroll in Home page ([d66778b](https://github.com/rudnovd/laundry-labels-app/commit/d66778b51b8ef3cf43c8411716de340b015e65f7))
* **views:** add welcome page ([a04038c](https://github.com/rudnovd/laundry-labels-app/commit/a04038ca578b443b0cd9148059552a4337159071))
* **views:** update profile page ([fddd33f](https://github.com/rudnovd/laundry-labels-app/commit/fddd33f093c9146d55ad3d22e5575d6810316317))
* **views:** update registration page ([3577f0f](https://github.com/rudnovd/laundry-labels-app/commit/3577f0fc128d58f9bac42dbf1b98d942e60a3d1d))


### Bug Fixes

* **CreateItemPage:** fix page errors ([d0fe1e0](https://github.com/rudnovd/laundry-labels-app/commit/d0fe1e08a8022a4ce2c2bec2435d934c86d25bd9))
* **eslint:** fix eslint errors ([5c2856e](https://github.com/rudnovd/laundry-labels-app/commit/5c2856eccd24fed5d37f4aef8fa09354778690c8))
* **interfaces:** update userItemBlank interface ([d9310d3](https://github.com/rudnovd/laundry-labels-app/commit/d9310d360fc32f272164f650f5f6600808695156))
* **LaundryCardSkeleton:** remove old layout ([af3d9f4](https://github.com/rudnovd/laundry-labels-app/commit/af3d9f4660a76fbed98d30e7e76a329cce22a2e1))
* **LaundryCard:** update component styles ([6f03920](https://github.com/rudnovd/laundry-labels-app/commit/6f039205e5f3eebd0c57c3847eb78a815df1e103))
* **LaundryCard:** use new userItem interface field ([4d322e3](https://github.com/rudnovd/laundry-labels-app/commit/4d322e372b1756ae6948fd3f4d524d8dee8a152e))
* **Layout:** show profile icon if user logged in ([73744f8](https://github.com/rudnovd/laundry-labels-app/commit/73744f8d9ddeb74972b96399d09e5656e84bacdd))
* **Logout:** redirect path after sign out ([a23803e](https://github.com/rudnovd/laundry-labels-app/commit/a23803e4b4ea95503d6290e2562adf06828b48e1))
* **views:** add disabled state for buttons in CreateItem component ([19338b2](https://github.com/rudnovd/laundry-labels-app/commit/19338b2518d92da6c520a61ef2e43e92ffd49ef1))
* **views:** use new userItem interface field in item page ([483635e](https://github.com/rudnovd/laundry-labels-app/commit/483635e61a2167e312155e7b1e96b508a4ecf458))
