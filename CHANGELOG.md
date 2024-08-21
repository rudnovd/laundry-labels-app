# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.0.0-beta.1](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-beta.0...v0.0.0-beta.1) (2024-08-21)


### ⚠ BREAKING CHANGES

* use Set instead Array for symbols, photos, materials and tags

### Features

* add item materials ([d1c2ad3](https://github.com/rudnovd/laundry-labels-app/commit/d1c2ad3f62e8555afc3937fbc4f30272c59ce469))
* **App:** delay initial app loading displaying ([0fb498f](https://github.com/rudnovd/laundry-labels-app/commit/0fb498fee55c61516bacca400011f2643e28bea5))
* **components:** add chip component ([9067e0b](https://github.com/rudnovd/laundry-labels-app/commit/9067e0b72201434a779958dbc270b1f631d76f1e))
* **constants:** add allowed item filters keys ([3545aa8](https://github.com/rudnovd/laundry-labels-app/commit/3545aa8862d8a8f05a295a3b7fecc964d2d0d78d))
* **constants:** update items limit ([fe5ea7c](https://github.com/rudnovd/laundry-labels-app/commit/fe5ea7c82330b00d47a1084e1832e172d0e20fc1))
* **data:** add laundry symbols short description ([c9bc08f](https://github.com/rudnovd/laundry-labels-app/commit/c9bc08f2b69b3d41b957cf3052bdfc4bda160b3f))
* **i18n:** add ru plural rule ([34d2ba5](https://github.com/rudnovd/laundry-labels-app/commit/34d2ba560a61180e514716d547962b2f87b4d87c))
* **InputItemTags:** update component ([a48a9d7](https://github.com/rudnovd/laundry-labels-app/commit/a48a9d78d646c216b115f20452a3f9c474138ded))
* **InputItemTags:** update component ([80816ae](https://github.com/rudnovd/laundry-labels-app/commit/80816ae03cc408d5c3e0d211a06b14e6aa29ae25))
* **items:** fill custom tags after get items ([c7b34be](https://github.com/rudnovd/laundry-labels-app/commit/c7b34bedf75a41d6eab08edd39d07871c41fb98c))
* **ItemsPage:** add filters handling ([5c40df9](https://github.com/rudnovd/laundry-labels-app/commit/5c40df9fc7a46e884ecfdee30c14b28d2a8a6a48))
* **LaundrySymbolsButtonGroup:** add hints for symbols groups ([240f11a](https://github.com/rudnovd/laundry-labels-app/commit/240f11ab64d7ae62fe0fcaa57a60b84ae0b5a84f))
* **locales:** update locales ([9c81aef](https://github.com/rudnovd/laundry-labels-app/commit/9c81aefe431edcda5c749234a478254750fda2a0))
* **ModifyItemPage:** disable 'edit' button if item has no changes ([a7b4e0c](https://github.com/rudnovd/laundry-labels-app/commit/a7b4e0cb079d06d66345df1a91bbdd237f92dfcd))
* **ModifyItemPage:** display confirmation alert when leave with unsaved changes ([75a583e](https://github.com/rudnovd/laundry-labels-app/commit/75a583ef6d3b50ec88fe9ccb5f72ab6a8cdb3c9a))
* **pages:** add filter items dialog ([478be1f](https://github.com/rudnovd/laundry-labels-app/commit/478be1fa39a4ce3558b6a277cf443db28c2a7726))
* **ProfilePage:** add email confirmation button ([53eb479](https://github.com/rudnovd/laundry-labels-app/commit/53eb47966369730008a3c5397c7156d2a5717716))
* **RedirectPage:** update page styles ([0d0eb21](https://github.com/rudnovd/laundry-labels-app/commit/0d0eb21ce08a1ca30823ade61aef61aff0be8e14))
* **service-worker:** cache items and photos ([06dec2c](https://github.com/rudnovd/laundry-labels-app/commit/06dec2c143b7246c40fc8583ad2eaf5fc445fdd4))
* **store:** move laundry data from items store ([efef2e1](https://github.com/rudnovd/laundry-labels-app/commit/efef2e1cd52027883d0dcd5543eb329ec8e2100d))
* use Set instead Array for symbols, photos, materials and tags ([18421dc](https://github.com/rudnovd/laundry-labels-app/commit/18421dc26b56eda83152b44b64ab50fe220a16c3))
* **UserProfile:** display current user ([5ebae71](https://github.com/rudnovd/laundry-labels-app/commit/5ebae710d9b56b68e678c34e045862297e1d1ac9))


### Bug Fixes

* **CoreOptionsDialog:** remove persistent ([21248df](https://github.com/rudnovd/laundry-labels-app/commit/21248df7681d1dd20ae581e70fef20b7558e6408))
* fix dialogs closing ([03ef756](https://github.com/rudnovd/laundry-labels-app/commit/03ef756c21bc194f810bd3240783adde926a68d0))
* **ItemMaterialCheckbox:** fix component input ([6262143](https://github.com/rudnovd/laundry-labels-app/commit/626214331bc2a939a749be83f9982da0b4ff3033))
* **ItemPage:** fix component styles ([7a9f274](https://github.com/rudnovd/laundry-labels-app/commit/7a9f274da199983674efa5aca762fa1557005cc7))
* **ItemPage:** fix loading spinner styles ([d82c8ba](https://github.com/rudnovd/laundry-labels-app/commit/d82c8ba9035e9a9a3ab5850df997760e6622cbc1))
* **ItemPage:** fix photo sizes ([3fe1f0e](https://github.com/rudnovd/laundry-labels-app/commit/3fe1f0ed98a195feaab897911b0918e8f4a340fd))
* **ItemsPage:** fix migration types ([a4e1d5a](https://github.com/rudnovd/laundry-labels-app/commit/a4e1d5a440c815dd92ff2e34993d0bb0588c6fad))
* **ItemsPage:** fix repetitive filtering items ([e8e81c7](https://github.com/rudnovd/laundry-labels-app/commit/e8e81c7806cdbf8aa68889d621d832add227b994))
* **items:** set max width and change compressed photo max size ([70f897a](https://github.com/rudnovd/laundry-labels-app/commit/70f897ac8bec8a958c52f31a061fdc0945e1f868))
* **LanguageOptionsDialog:** remove persistent ([180b776](https://github.com/rudnovd/laundry-labels-app/commit/180b7764f811be193684de61015612f96b4bf8fb))
* **LaundryCard:** fix component styles ([f84cc07](https://github.com/rudnovd/laundry-labels-app/commit/f84cc07d7bfe703fd0578e14a0413ed89a748e95))
* **locales:** fix wrong 'updating app' key path ([2cd073e](https://github.com/rudnovd/laundry-labels-app/commit/2cd073ed00895166199c67ae36f4b6ac7f53f452))
* **materials:** lowercase materials data ([37a90ae](https://github.com/rudnovd/laundry-labels-app/commit/37a90ae2b9f0637ea7d3d1ab67ed3a29fc28f9a8))
* **ProfilePage:** correct text of sign out dialog ([c3554b6](https://github.com/rudnovd/laundry-labels-app/commit/c3554b665fcb84ad34e30b4b24036400e060a42c))
* **ProfilePage:** disable password changing for 'google' provider ([cbe720f](https://github.com/rudnovd/laundry-labels-app/commit/cbe720fc877903c4c790e885ad6b71ea97f75abe))
* **router-view:** fix pages rendering in every router-view component ([e0a18af](https://github.com/rudnovd/laundry-labels-app/commit/e0a18afe1d6dd2a5030b98a65c15687b2847b511))

## [0.0.0-beta.1](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-beta.0...v0.0.0-beta.1) (2024-03-25)


### ⚠ BREAKING CHANGES

* use Set instead Array for symbols, photos, materials and tags

### Features

* add item materials ([d1c2ad3](https://github.com/rudnovd/laundry-labels-app/commit/d1c2ad3f62e8555afc3937fbc4f30272c59ce469))
* **LaundrySymbolsButtonGroup:** add hints for symbols groups ([240f11a](https://github.com/rudnovd/laundry-labels-app/commit/240f11ab64d7ae62fe0fcaa57a60b84ae0b5a84f))
* **ModifyItemPage:** disable 'edit' button if item has no changes ([a7b4e0c](https://github.com/rudnovd/laundry-labels-app/commit/a7b4e0cb079d06d66345df1a91bbdd237f92dfcd))
* **ModifyItemPage:** display confirmation alert when leave with unsaved changes ([75a583e](https://github.com/rudnovd/laundry-labels-app/commit/75a583ef6d3b50ec88fe9ccb5f72ab6a8cdb3c9a))
* **RedirectPage:** update page styles ([0d0eb21](https://github.com/rudnovd/laundry-labels-app/commit/0d0eb21ce08a1ca30823ade61aef61aff0be8e14))
* use Set instead Array for symbols, photos, materials and tags ([18421dc](https://github.com/rudnovd/laundry-labels-app/commit/18421dc26b56eda83152b44b64ab50fe220a16c3))
* **UserProfile:** display current user ([5ebae71](https://github.com/rudnovd/laundry-labels-app/commit/5ebae710d9b56b68e678c34e045862297e1d1ac9))


### Bug Fixes

* **ItemPage:** fix photo sizes ([3fe1f0e](https://github.com/rudnovd/laundry-labels-app/commit/3fe1f0ed98a195feaab897911b0918e8f4a340fd))
* **ItemsPage:** fix migration types ([a4e1d5a](https://github.com/rudnovd/laundry-labels-app/commit/a4e1d5a440c815dd92ff2e34993d0bb0588c6fad))
* **ProfilePage:** disable password changing for 'google' provider ([cbe720f](https://github.com/rudnovd/laundry-labels-app/commit/cbe720fc877903c4c790e885ad6b71ea97f75abe))

## [0.0.0-beta.0](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.11...v0.0.0-beta.0) (2024-03-06)


### ⚠ BREAKING CHANGES

* **router:** rewrite router to supabase auth logic
* **store:** migrate items store to supabase
* **store:** migrate user store to supabase
* init supabase

### Features

* add constants ([0343e92](https://github.com/rudnovd/laundry-labels-app/commit/0343e92421f12fa78f9f253146070d6171d801af))
* add demo tour ([ec4183a](https://github.com/rudnovd/laundry-labels-app/commit/ec4183a61eb70307f4bffa62a13069fc75700c6e))
* add functions for import or export items ([d3d160a](https://github.com/rudnovd/laundry-labels-app/commit/d3d160a4e3559e372a126179693657d50d40c64d))
* **app:** add 'usePwa' composable in 'App' component ([9fa9970](https://github.com/rudnovd/laundry-labels-app/commit/9fa9970412667dd3d68f15f642edaf286447e5ad))
* **App:** get standard symbols once when entering on item pages ([50e66d4](https://github.com/rudnovd/laundry-labels-app/commit/50e66d4ae5e6d1130740f2cc9a373334815914f2))
* **App:** init user settings in localstorage on first load ([a4f0d03](https://github.com/rudnovd/laundry-labels-app/commit/a4f0d034366bf904722fa8a7652242da66db9365))
* **App:** set app locale and user check session on before mount app ([b39b56c](https://github.com/rudnovd/laundry-labels-app/commit/b39b56c852b9915cecf272fe3714ddbdd36394a3))
* **components:** add ItemPhoto component ([94f350e](https://github.com/rudnovd/laundry-labels-app/commit/94f350e4195cda34cbbb5244b561fa5263c1351d))
* **components:** add ItemTag component ([ad8c3fd](https://github.com/rudnovd/laundry-labels-app/commit/ad8c3fd9b0b407e8fd394b0476f73863759e6d60))
* **components:** move hcaptcha in single component ([5dcaadc](https://github.com/rudnovd/laundry-labels-app/commit/5dcaadc5441e2bec5ce428b6220b30046a77b57c))
* **components:** rewrite and divide item symbols selection component ([3ef3f34](https://github.com/rudnovd/laundry-labels-app/commit/3ef3f34a42f5e37a9e989c533e1275186e03ebb8))
* **components:** update LaundryCard components ([aae0486](https://github.com/rudnovd/laundry-labels-app/commit/aae0486e045795ab42ebe58024071a0169f6b22e))
* **composables:** add useItems composable ([98c7880](https://github.com/rudnovd/laundry-labels-app/commit/98c7880236843ab8aa28ce395e2bfb59c5eee87b))
* **composables:** update useItems composable ([106ee76](https://github.com/rudnovd/laundry-labels-app/commit/106ee76fdf6b524f6afb71e201fc0237f70f8acf))
* **constants:** add Bedding group ([0ab8a10](https://github.com/rudnovd/laundry-labels-app/commit/0ab8a103d74e47bad84d8d374ce9b1f56b4bfd2d))
* **constants:** add Bedding group ([e5165d6](https://github.com/rudnovd/laundry-labels-app/commit/e5165d6d77d2aec16f75a727ad3fb9f155928a53))
* **constants:** add new constants and move in src/constants ([972ec39](https://github.com/rudnovd/laundry-labels-app/commit/972ec398e73b48b60088c587293c5a61dc3a3c0f))
* **CreateItemPage:** add item validation ([7bc9d69](https://github.com/rudnovd/laundry-labels-app/commit/7bc9d699b3746171d01d7550824459d235914efd))
* **CreateItemPage:** use function from composable ([0822358](https://github.com/rudnovd/laundry-labels-app/commit/08223584d09e639a0ebdb90ee279a8f6e0fea75d))
* **db:** update offline database fields ([c5849a9](https://github.com/rudnovd/laundry-labels-app/commit/c5849a94efe17d5d883bd307102c7ef258134710))
* **EditItemPage:** update page ([4bf652d](https://github.com/rudnovd/laundry-labels-app/commit/4bf652dcf057a4c051aeb37ed6e161156f8a8cbf))
* **icons:** add google logo icon ([e50c40a](https://github.com/rudnovd/laundry-labels-app/commit/e50c40a1b0775a84d84c43f024504bb83c3f75cd))
* init database ([3f06e5c](https://github.com/rudnovd/laundry-labels-app/commit/3f06e5c2986a932187946d4697bb88c49e867ca6))
* init supabase ([0e7e7de](https://github.com/rudnovd/laundry-labels-app/commit/0e7e7de4ddd0fbabfdaf280d9047bd1c2f402921))
* **InputItemTags:** update component ([c3e02c8](https://github.com/rudnovd/laundry-labels-app/commit/c3e02c8a1564941100852f80424610289aff171e))
* **ItemPage:** add button to save the offline item to the server ([0d188db](https://github.com/rudnovd/laundry-labels-app/commit/0d188db654abb4a53924399753ab4fe0f3b57e2b))
* **ItemPage:** update component ([a11d7f8](https://github.com/rudnovd/laundry-labels-app/commit/a11d7f8c94fc649779ae0cf4f5c889f75a4a51a0))
* **items:** add migration items functions ([2d5e484](https://github.com/rudnovd/laundry-labels-app/commit/2d5e484990803d8ef4aa1ea9e69f1dc1547f58ed))
* **ItemsPage:** update page ([499f97f](https://github.com/rudnovd/laundry-labels-app/commit/499f97f2a21e6872193b17b831a60b57e7bcf3fe))
* **ItemsPage:** use function from composable, add more validation ([8f66e40](https://github.com/rudnovd/laundry-labels-app/commit/8f66e4096b78c80d9892b519df76cc49f1f7a052))
* **ItemTag:** add gap ([3786548](https://github.com/rudnovd/laundry-labels-app/commit/3786548b2dab07cad52c033d3937fdcbbe20d182))
* **laundry-icons:** move laundry icons data from locales to data assets ([3d4019b](https://github.com/rudnovd/laundry-labels-app/commit/3d4019b4a9ec848b88450e60608d3c8a33a5c916))
* **LaundryCard:** add icon to display offline item ([df0e768](https://github.com/rudnovd/laundry-labels-app/commit/df0e7684766b37aeff383de2f53feb3289cef5ec))
* **locales:** update tokens ([a5a63b3](https://github.com/rudnovd/laundry-labels-app/commit/a5a63b3ce0b872ae6010777dac72e2a847fae272))
* **localStorage:** add merge defaults function for user settings storage ([6f85ca1](https://github.com/rudnovd/laundry-labels-app/commit/6f85ca14f2c524eda5779ab2c19cb595b5d68a17))
* **migration:** add 'isMigrated' flag to localstorage ([5a43310](https://github.com/rudnovd/laundry-labels-app/commit/5a433101bc83ed55de1141a8fd416507dfe42ff2))
* **pages:** add 'reset password' page ([630f818](https://github.com/rudnovd/laundry-labels-app/commit/630f818cabc8ebf09431bda3e7fa78684c2e59f5))
* **Profile:** add password update dialog ([b17d345](https://github.com/rudnovd/laundry-labels-app/commit/b17d3455f6fbd82abd2511dbcfebb94c284499e3))
* **profile:** add sign out message ([ee9ecdb](https://github.com/rudnovd/laundry-labels-app/commit/ee9ecdbf93842e19eeb3e517436625c966fc09f6))
* **ProfilePage:** add 'import', 'export' and 'password update' buttons ([bcacf11](https://github.com/rudnovd/laundry-labels-app/commit/bcacf11ba9eb7d6f5416e5f1979f7e57c0178570))
* **ProfilePage:** move dialogs scripts in dialogs pages ([c61bb6f](https://github.com/rudnovd/laundry-labels-app/commit/c61bb6fab26f70e3e23a35394dd7c18717d8cee1))
* **ProfilePage:** update page ([814b3cf](https://github.com/rudnovd/laundry-labels-app/commit/814b3cfca8a65287d2911c6aea2d54a81b815c51))
* **request:** add offline mode check in beforeRequest ([0faeaac](https://github.com/rudnovd/laundry-labels-app/commit/0faeaacc9c20872f715d785011218e81cb13dacb))
* **router:** rewrite router to supabase auth logic ([f164bcc](https://github.com/rudnovd/laundry-labels-app/commit/f164bccaa207ff23936518f5a8f1fc148b6ce86e))
* **SignInPage:** refactor page and add google oauth ([8520302](https://github.com/rudnovd/laundry-labels-app/commit/85203020d7c405d03b5b55182b401b4ce2f83a52))
* **SignUpPage:** refactor page and add google oauth ([d5d89d4](https://github.com/rudnovd/laundry-labels-app/commit/d5d89d42416a2ecc94e4fc08404f23bc50a181c3))
* **store:** add 'getPhoto' item function ([34b5f9b](https://github.com/rudnovd/laundry-labels-app/commit/34b5f9b3e7ad8e2d798a89b787929d7d96fcba5c))
* **store:** add 'getSession' method in user store ([b2892b0](https://github.com/rudnovd/laundry-labels-app/commit/b2892b09c21fa289e9713677347fbda03d6616b5))
* **store:** add reactive isOnline user state ([71261e3](https://github.com/rudnovd/laundry-labels-app/commit/71261e38ba726dfe17ab94387f73d0713091ca47))
* **store:** add store for app settings ([1584f0b](https://github.com/rudnovd/laundry-labels-app/commit/1584f0b63fd750f9bd270d2fb9c2715c9398c289))
* **store:** add store for offline user items ([f2c1baa](https://github.com/rudnovd/laundry-labels-app/commit/f2c1baae5fce80ff88e2346252ecf1ea86d6bfee))
* **store:** migrate items store to supabase ([18b7e8a](https://github.com/rudnovd/laundry-labels-app/commit/18b7e8ac62a956ea2a85593e3143be404ead8926))
* **store:** migrate user store to supabase ([a3ecf27](https://github.com/rudnovd/laundry-labels-app/commit/a3ecf2703ae477f475bcdef7d54d98f0e1c3c902))
* **store:** simplify methods arguments ([f071c59](https://github.com/rudnovd/laundry-labels-app/commit/f071c59fdde634851ccfc31ba4662048077e166f))
* **store:** update ErrorResponse type ([911896d](https://github.com/rudnovd/laundry-labels-app/commit/911896de8777fd29f1098cb463b29f62aa6913a7))
* **store:** update offline items store ([f96959d](https://github.com/rudnovd/laundry-labels-app/commit/f96959dc07a1209689e7212ce45f4db7d56c09e8))
* **store:** use local storage composable for user settings ([686f0d6](https://github.com/rudnovd/laundry-labels-app/commit/686f0d67fd595634d344d28318c080e083a6aa8a))
* **store:** use Maps types for items getters ([cc5412c](https://github.com/rudnovd/laundry-labels-app/commit/cc5412cca054fdd5369b9d691726cad4602cc613))
* **styles:** replace scss to css for main styles file, add new styles ([7313c36](https://github.com/rudnovd/laundry-labels-app/commit/7313c36cbc3c8aad232daf050a36f289696c7f07))
* **types:** add offlineMode in UserSettings interface ([c59c04c](https://github.com/rudnovd/laundry-labels-app/commit/c59c04c99e0da961cfbadddedb3028d8b8eab507))
* **UploadItemImage:** add uploading for offline items ([e395118](https://github.com/rudnovd/laundry-labels-app/commit/e395118bfe50f6d50bcf2502a0e141b57c70204f))
* **UploadItemPhoto:** update component ([f1f4e23](https://github.com/rudnovd/laundry-labels-app/commit/f1f4e23913bdd14ab18d739cc1153ae5adeeeb42))
* **UserLayout:** add offline icon in header ([bfd92d4](https://github.com/rudnovd/laundry-labels-app/commit/bfd92d4bf5b15dc09e9687018af52fa5e4245912))
* **UserLayout:** check user session after deactivate offline mode ([a0d827e](https://github.com/rudnovd/laundry-labels-app/commit/a0d827e52b2debaa828e261c735bab67a30e98b5))
* **UserLayout:** update logo text styles ([5a87d50](https://github.com/rudnovd/laundry-labels-app/commit/5a87d507af5b0ed41ef9fd3720cf42768aa8d97a))


### Bug Fixes

* **App:** fix first symbols fetching ([3af5b2a](https://github.com/rudnovd/laundry-labels-app/commit/3af5b2aac839a0aef600ace17a602effc398d9b0))
* **App:** set initial locale from localStorage ([c8e5e87](https://github.com/rudnovd/laundry-labels-app/commit/c8e5e872c97f4477ddda70899ea605356053e807))
* fix lint errors ([56a3e8a](https://github.com/rudnovd/laundry-labels-app/commit/56a3e8ac88684430ef8da46d4940af17fd50b3a2))
* **HomePage:** fix grid columns for small screen resolution ([96e8d9b](https://github.com/rudnovd/laundry-labels-app/commit/96e8d9bd1a1bf93353178bb3fc461e41e5681ee6))
* **ItemPage:** hide 'save on server' button if user not authenticated or offline ([2c9ee85](https://github.com/rudnovd/laundry-labels-app/commit/2c9ee8509716e3f0d3da8b86b0384a7a7c9b9d4a))
* **ItemsPage:** use ItemTag component for searching tags ([02cf65d](https://github.com/rudnovd/laundry-labels-app/commit/02cf65d870318e779dea67a7628e794330cf7458))
* **ItemsPage:** use local ref for 'is loading' state ([49131fb](https://github.com/rudnovd/laundry-labels-app/commit/49131fb30368a857de80d138e5c7eb8cae684b42))
* **LaundryCard:** disable pointer events for laundry symbols inside card ([e17737b](https://github.com/rudnovd/laundry-labels-app/commit/e17737b3151721c155e1f181f4a7378d4f4f04b7))
* **LaundrySymbolsButtonGroup:** add optional chaining for selected symbol ([14cb7e8](https://github.com/rudnovd/laundry-labels-app/commit/14cb7e831de359d82fbb6b56ecfde42c47dd0f6e))
* **pages:** reset captcha after 'sign in' or 'sign up' error ([89239b6](https://github.com/rudnovd/laundry-labels-app/commit/89239b6f076e2b337be2151c79a57dfb48abb738))
* **ProfilePage:** not render import/export buttons if File System API not supported ([c3e6d84](https://github.com/rudnovd/laundry-labels-app/commit/c3e6d843d557d773737c55b4b8dae6dad4ddd8ca))
* **store:** redirect to origin domain when sign in with OAuth ([ee3a5dc](https://github.com/rudnovd/laundry-labels-app/commit/ee3a5dc787c4bf7beaf92614ff7f5e42aa696d3f))
* **store:** remove settings composable from user store ([1ce23f9](https://github.com/rudnovd/laundry-labels-app/commit/1ce23f901a009b022cad6eacfde00e9ff0da3a98))
* **store:** use local data in 'getStandardTags' and 'getStandardSymbols' functions ([9b68e8e](https://github.com/rudnovd/laundry-labels-app/commit/9b68e8e3e12e08199f409abd5f577b257284cafd))
* **types:** fix supabase types ([d313e3e](https://github.com/rudnovd/laundry-labels-app/commit/d313e3efcd61efdbfd83f687576ddf017709b2f2))
* **UpdatePasswordDialog:** fix password validation ([ff2cb5d](https://github.com/rudnovd/laundry-labels-app/commit/ff2cb5d24b5cac813abfdc240bdceb2c496531e2))
* **UploadItemImage:** hide empty container ([e276a4e](https://github.com/rudnovd/laundry-labels-app/commit/e276a4e1ccd7611eb1320c06bbb6e11b09a0d5f2))
* **useDemoMode:** update tour elements ([54b734b](https://github.com/rudnovd/laundry-labels-app/commit/54b734bc1963d68db6bf93813ee81c17a705a716))
* **useItems:** flat getItems result ([db54919](https://github.com/rudnovd/laundry-labels-app/commit/db54919ad9ab103f642844abf02c61d8cdfb65ca))

## [0.0.0-alpha.11](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.10...v0.0.0-alpha.11) (2023-05-01)


### Features

* **constants:** move item tags in constants ([04da059](https://github.com/rudnovd/laundry-labels-app/commit/04da0597351977b8352c391cfb1b024c771f7237))
* **InputItemTags:** update component ([2ba6564](https://github.com/rudnovd/laundry-labels-app/commit/2ba65647ae9aedc77d03b88f9ac3caacf9ae0a5d))
* **ProfilePage:** add selecting language for items tags ([c3cdca1](https://github.com/rudnovd/laundry-labels-app/commit/c3cdca1a24f192a966bf21ba15867046e48db691))
* **store:** add upload image function ([0c8c33a](https://github.com/rudnovd/laundry-labels-app/commit/0c8c33afccb72a7debac8358d05bdf5bdf29f0b9))
* **UploadItemImage:** update component ([d43d621](https://github.com/rudnovd/laundry-labels-app/commit/d43d6213508dfcf6cf7193203bc8a7b4bc047b44))


### Bug Fixes

* **SignUpPage:** catch signIn function error ([c4613c7](https://github.com/rudnovd/laundry-labels-app/commit/c4613c7ed316a05f9778be22dd7e97e68b7b48f0))

## [0.0.0-alpha.10](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.9...v0.0.0-alpha.10) (2023-04-16)


### Features

* **ItemPage:** load item in offline ([a615c6c](https://github.com/rudnovd/laundry-labels-app/commit/a615c6cafec0e66dcf918230cc6c145cc6d35f26))
* **SignUpPage:** sign in if email already registered ([698be36](https://github.com/rudnovd/laundry-labels-app/commit/698be36bf624ce22fc0f130e776b8222cb85ff7b))


### Bug Fixes

* **ItemPage:** fix text-overflow ([36bd572](https://github.com/rudnovd/laundry-labels-app/commit/36bd57269a100fcc0c28d46788f7924bf72016b8))
* **request:** stop update access token in offline ([f23c189](https://github.com/rudnovd/laundry-labels-app/commit/f23c18972c2b32313ecbc41366880a82441e40e2))

## [0.0.0-alpha.9](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.8...v0.0.0-alpha.9) (2023-03-14)


### Features

* add i18n lib ([1f4ce23](https://github.com/rudnovd/laundry-labels-app/commit/1f4ce2366e32821713eacb4d279df6d1ed779d5d))
* add Localazy ([acf1ff7](https://github.com/rudnovd/laundry-labels-app/commit/acf1ff7c27e13c63e5b431ce3f80651a6087a668))
* **EditItemPage:** add image editing for items ([1168d38](https://github.com/rudnovd/laundry-labels-app/commit/1168d38299f8317654e064555fe77a23f3e2edf3))
* **i18n:** add tokens, locale files ([a964154](https://github.com/rudnovd/laundry-labels-app/commit/a9641548fef847c05850691b3fc8ff141d9c5f79))
* **i18n:** update i18n ([e109b10](https://github.com/rudnovd/laundry-labels-app/commit/e109b10dbf3183c6ee4ddff75ef805b0ffd21684))
* **laundry-icons:** divide 'drying' group to 'dry cleaning' and 'natural drying' ([bd202e4](https://github.com/rudnovd/laundry-labels-app/commit/bd202e48dd400cb2ddfc8e8b42881806842adf70))


### Bug Fixes

* **eslint:** fix errors ([23853a8](https://github.com/rudnovd/laundry-labels-app/commit/23853a886425d934de6f492cb0379aa7bd33f25d))
* fix validation in SignIn/SignUp pages ([dcdfdfd](https://github.com/rudnovd/laundry-labels-app/commit/dcdfdfdda45469e7b2e625960b165ca8cafbcfe3))
* **stylelint:** fix errors ([5edebeb](https://github.com/rudnovd/laundry-labels-app/commit/5edebeb2dea17f520eb0334a1d353c8e9e5fb321))

## [0.0.0-alpha.8](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.7...v0.0.0-alpha.8) (2023-02-25)


### Features

* add 'brand' color ([744cb81](https://github.com/rudnovd/laundry-labels-app/commit/744cb81b64dba45505fbae0db7cfb963698837e3))
* add component for svg icons ([d0d5c53](https://github.com/rudnovd/laundry-labels-app/commit/d0d5c53680b78929b48f4b1fc44323fb3e394b06))
* add new component for tags selecting ([138b823](https://github.com/rudnovd/laundry-labels-app/commit/138b82373859d30b5b5d08bdacea71c2db6570e3))
* allow disable auto update app ([e7d9408](https://github.com/rudnovd/laundry-labels-app/commit/e7d94083d5da5a2c9ee485a0ef34c1e348140048))
* **CreateItemPage:** use new tags component, refactor ([4416d2c](https://github.com/rudnovd/laundry-labels-app/commit/4416d2cf3d2045662beb7a96c1adf59835c13a76))
* **EditItemPage:** use new tags component, refactor ([bbc7a8e](https://github.com/rudnovd/laundry-labels-app/commit/bbc7a8e05c51f431dc5664b918db57717e1ea9ea))
* **HomePage:** update home page ([215fa2a](https://github.com/rudnovd/laundry-labels-app/commit/215fa2a3c218204fb538af84f4e6c2d708ded170))
* **router:** add title for Home page ([b456a17](https://github.com/rudnovd/laundry-labels-app/commit/b456a17cd9c3bf2bd29ea6e06c66d8e79e726e37))
* **SignInPage:** update page styles ([1bd7cda](https://github.com/rudnovd/laundry-labels-app/commit/1bd7cda9583c9d05665b21486e336d44c7bbfa18))
* **SignUpPage:** update page styles ([406c287](https://github.com/rudnovd/laundry-labels-app/commit/406c2878a29f013b0c983a08a6b58d60ab7e6b05))
* **UserLayout:** update layout styles ([c6852e0](https://github.com/rudnovd/laundry-labels-app/commit/c6852e0a7386d7290a988fe5e8d64ffac6e801f8))


### Bug Fixes

* **img:** use fit contain instead of cover ([fc0b74a](https://github.com/rudnovd/laundry-labels-app/commit/fc0b74aa9a2dfe7b21d475558c1ec1b047ae29cf))
* **InputItemTags:** fix tags duplications from input ([a85939f](https://github.com/rudnovd/laundry-labels-app/commit/a85939f4400f08f7794c8124f32ecbc454cc6cd2))
* **ItemPage:** add item name to delete dialog ([b1dc693](https://github.com/rudnovd/laundry-labels-app/commit/b1dc69382c55bdc01c2babc6c7b3a4d705f0eece))
* **ItemPage:** move item name to the top, add outline prop to buttons ([6631ca9](https://github.com/rudnovd/laundry-labels-app/commit/6631ca9802ea97bb0660a40d005baa50fc75973b))
* **Items Page:** hide add item button if list is empty, update empty list text ([44a0e37](https://github.com/rudnovd/laundry-labels-app/commit/44a0e37be082f733efa31d6e6fd78ad2651ad8f4))
* **LaundryCard:** refactor, fix tooltip ([ea2eeef](https://github.com/rudnovd/laundry-labels-app/commit/ea2eeefceb8c4a20085f545b901d1339c5f048f6))
* **LaundryCardSkeleton:** update styles to look more like populated card ([1838781](https://github.com/rudnovd/laundry-labels-app/commit/183878187f49d4b4321c90e8d2fcdc811bb3decd))
* remove 'Item' from texts ([19ffd9f](https://github.com/rudnovd/laundry-labels-app/commit/19ffd9fef866a620a9a9316fecbc4552cbf92ffa))
* **UploadItemImage:** fix errors handling ([aa23a9d](https://github.com/rudnovd/laundry-labels-app/commit/aa23a9d376394f503d15623551a7116f5c189568))

## [0.0.0-alpha.7](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.6...v0.0.0-alpha.7) (2023-02-14)


### Features

* **ItemsPage:** add clear tags, refactor searching ([488c2e2](https://github.com/rudnovd/laundry-labels-app/commit/488c2e22fe094546f00534a8d9b4d26775d12060))
* **ItemsPage:** add searching by tags ([623e9b7](https://github.com/rudnovd/laundry-labels-app/commit/623e9b7937e9b9142ed41c097782b8752e884f63))

## [0.0.0-alpha.6](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.5...v0.0.0-alpha.6) (2023-02-11)


### Features

* **ProfilePage:** update component ([c663bb3](https://github.com/rudnovd/laundry-labels-app/commit/c663bb31d4b6d6f01201c205e813490c04c7c99a))
* **router:** add redirect from 'Home' page ([3444b3c](https://github.com/rudnovd/laundry-labels-app/commit/3444b3cdade30a3e416268a6694ba244db7087aa))
* **service-worker:** add new caches ([83ed00e](https://github.com/rudnovd/laundry-labels-app/commit/83ed00e6f50d61b1a5f8c173d5e7c321ca754373))

## [0.0.0-alpha.5](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.4...v0.0.0-alpha.5) (2023-02-05)


### Features

* add disabled dark mode for future release ([8e4c58c](https://github.com/rudnovd/laundry-labels-app/commit/8e4c58cff15dcb062f21989e81ce2c6d15bcb098))
* add install PWA install button ([7745ae2](https://github.com/rudnovd/laundry-labels-app/commit/7745ae2a4c676d02709601d119c5290879d22038))
* **HomePage:** update styles ([d5ddd4b](https://github.com/rudnovd/laundry-labels-app/commit/d5ddd4ba19b20fa9381f82d2ee34a9295e6287ef))
* **icons:** add new laundry icons ([7ff98d2](https://github.com/rudnovd/laundry-labels-app/commit/7ff98d242e900ce3c26a72765887ae4fbe115f50))
* **index.html:** add new meta tags ([d51769d](https://github.com/rudnovd/laundry-labels-app/commit/d51769d15e2f7a707cd4db9a3ae2cc20ec72a734))
* **ItemPage:** update component styles ([8b3f399](https://github.com/rudnovd/laundry-labels-app/commit/8b3f399453bbfc1411ae506655a3551f55c3254a))
* **ProfilePage:** update styles ([3253f33](https://github.com/rudnovd/laundry-labels-app/commit/3253f3358edcbe8ffa3e40a2e1a5fc3a40e0e4ca))
* **SignInPage:** update styles ([d959ae8](https://github.com/rudnovd/laundry-labels-app/commit/d959ae8c11ca458749d5f91d13f267fe658601a1))
* **SignUpPage:** update styles ([13ecbab](https://github.com/rudnovd/laundry-labels-app/commit/13ecbab4189004e35334b158711f8d4ca064af0d))
* update router ([b89fb54](https://github.com/rudnovd/laundry-labels-app/commit/b89fb5408dc8e955e65bcddcf0b34f0b51887c0c))


### Bug Fixes

* **EditItemPage:** displaying image ([5a1ea3e](https://github.com/rudnovd/laundry-labels-app/commit/5a1ea3e5bd5a92eb84014292ad5029185820280d))
* **router:** disable redirect for offline users ([8004c6f](https://github.com/rudnovd/laundry-labels-app/commit/8004c6f15f35e80e978d4bba9869bf06d8b9cc79))
* **UserLayout:** change back icon class, fix KeepAlive ([fbb0466](https://github.com/rudnovd/laundry-labels-app/commit/fbb0466b5d20b188eca02fb7dcf1221892cc2ab9))

## [0.0.0-alpha.4](https://github.com/rudnovd/laundry-labels-app/compare/v0.0.0-alpha.3...v0.0.0-alpha.4) (2023-01-28)


### Features

* **App:** add KeepAlive for Home page ([4d12d94](https://github.com/rudnovd/laundry-labels-app/commit/4d12d943a99971dcb1f28e1cca3855aabff63253))
* **icons:** update laundry icons ([2a2b08e](https://github.com/rudnovd/laundry-labels-app/commit/2a2b08e9c26d9a15466c0144bc078f58b71be811))
* **icons:** update laundryIcons object ([469943d](https://github.com/rudnovd/laundry-labels-app/commit/469943db11805f099388d9d6033b106e942577dd))
* **SelectItemTags:** update component features ([76dbee9](https://github.com/rudnovd/laundry-labels-app/commit/76dbee9b85925d7bf035ef813a3d3b7d8be2fffd))


### Bug Fixes

* **auth:** remove access token on 401 response ([736e297](https://github.com/rudnovd/laundry-labels-app/commit/736e297ce69acb7383152b15103dabc12f43f091))
* **LaundryIconsGroup:** fix group name title ([ca71ef9](https://github.com/rudnovd/laundry-labels-app/commit/ca71ef9e418c7c64342a45f88b259c44a2ec8f23))
* **UploadItemImage:** update photo limits ([d8edce3](https://github.com/rudnovd/laundry-labels-app/commit/d8edce3a91b967bcfd38380843829d7883616d55))

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
