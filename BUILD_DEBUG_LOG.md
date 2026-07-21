# Build Debug Log

## Project: Photo Studio Booking App (React Native CLI)

---

## Error 1: Missing Lock File

**Error:**
```
Dependencies lock file is not found. Supported file patterns: package-lock.json,...
```

**Cause:** `npm ci` and `actions/setup-node@v4` with `cache: 'npm'` both require a lock file.

**Fix:**
- Changed `npm ci` → `npm install` (generates lock file at build time)
- Removed `cache: 'npm'` from setup-node step

**Files:** `.github/workflows/build.yml`

---

## Error 2: Node 20 Deprecation

**Error:**
```
Node.js 20 is deprecated. The following actions target Node.js 20...
```

**Fix:** Changed `node-version: 20` → `node-version: 22`

**Files:** `.github/workflows/build.yml`

---

## Error 3: gradlew Not Found

**Error:**
```
chmod: cannot access 'gradlew': No such file or directory
```

**Cause:** Gradle wrapper files were not created in the project template.

**Fix:**
- Created `android/gradlew` and `android/gradlew.bat` wrapper scripts
- Added workflow step to download `gradle-wrapper.jar` from GitHub

**Files:** `android/gradlew`, `android/gradlew.bat`, `.github/workflows/build.yml`

---

## Error 4: React Native Gradle Plugin Not Found

**Error:**
```
Plugin [id: 'com.facebook.react.settings'] was not found in any of the following sources:
- Gradle Core Plugins
- Plugin Repositories (plugin dependency must include a version number)
```

**Attempt 1:** Added `@react-native/gradle-plugin` to `devDependencies` in `package.json`

**Attempt 2:** Removed `expo` from `package.json` (was causing lock-file contamination)

**Attempt 3 (failed):** The `includeBuild("../node_modules/@react-native/gradle-plugin")` kept failing even after adding the dependency. Root cause was unclear — possibly the plugin's `settings.gradle.kts` was incompatible with Gradle 8.6 or the npm package structure didn't match what `includeBuild` expected.

**Final fix:** Abandoned the RN Gradle plugin approach entirely. Replaced with:
- Simple `settings.gradle` (no plugin)
- Manual `react-android` version specification
- Dependency substitution for `react-native` → `react-android`
- `buildConfig true` on all subprojects
- Java/Kotlin target alignment

**Key insight:** The React Native Gradle plugin (`@react-native/gradle-plugin`) is optional. For a project with no native modules that require it, the manual approach is more reliable.

**Files:** `android/settings.gradle`, `android/build.gradle`, `android/app/build.gradle`

---

## Error 5: Expo Still in Build (Stale Lock File)

**Error:**
```
Build file '/home/runner/work/socialfeed/socialfeed/node_modules/expo/android/build.gradle' line: 4
unable to resolve class expo.modules.plugin.gradle.ExpoModuleExtension
```

**Cause:** Even though `expo` was removed from `package.json`, the committed `package-lock.json` still referenced it. `npm install` used the lock file and reinstalled expo.

**Fix:** Added `rm -f package-lock.json` before `npm install` in the workflow.

**Files:** `.github/workflows/build.yml`

---

## Error 6: buildConfig Disabled

**Error:**
```
defaultConfig contains custom BuildConfig fields, but the feature is disabled.
```

**Cause:** Android Gradle Plugin 8+ disables `BuildConfig` generation by default. Library modules (`react-native-vector-icons`, etc.) need it.

**Fix:** Added `buildFeatures { buildConfig true }` to all subprojects via `root build.gradle`'s `subprojects { afterEvaluate }` block.

**Files:** `android/build.gradle`

---

## Error 7: Dependency Substitution Syntax

**Error:**
```
No such property: using for class: UnversionedModuleComponentSelector
```

**Cause:** Groovy method chaining `substitute module("...") .using module("...")` was parsing incorrectly — `.using` was called on the `module()` result, not on `substitute()`.

**Fix:** Changed to explicit parentheses: `substitute(module("...")).using(module("..."))`

**Files:** `android/build.gradle`

---

## Error 8: Library Modules Can't Resolve react-native

**Error:**
```
Could not find any matches for com.facebook.react:react-native:+
Required by: project :react-native-safe-area-context
```

**Cause:** The dependency substitution was only in `app/build.gradle`, so library modules (`react-native-safe-area-context`, `react-native-screens`, etc.) still looked for the old `react-native` artifact.

**Fix:** Moved the dependency substitution from `app/build.gradle` to the root `build.gradle`'s `subprojects` block so it applies to all modules.

**Files:** `android/build.gradle`

---

## Error 9: JVM Target Mismatch

**Error:**
```
Inconsistent JVM-target compatibility detected for tasks 'compileReleaseJavaWithJavac' (1.8) and 'compileReleaseKotlin' (17)
```

**Cause:** Kotlin submodules compiled with JVM target 17, but Java sources targeted 1.8.

**Fix:** Added `compileOptions { sourceCompatibility VERSION_17; targetCompatibility VERSION_17 }` to all subprojects, plus `tasks.withType(KotlinCompile) { kotlinOptions.jvmTarget = "17" }`.

**Files:** `android/build.gradle`

---

## Error 10: Missing Launcher Icon

**Error:**
```
AAPT: error: resource mipmap/ic_launcher not found.
```

**Cause:** Manifest referenced `@mipmap/ic_launcher` but no icon files existed.

**Fix:** Created XML adaptive icon (`mipmap-anydpi-v26/ic_launcher.xml`) + fallback 1×1 PNGs in all mipmap density directories.

**Files:** `android/app/src/main/res/drawable/ic_launcher_background.xml`, `ic_launcher_foreground.xml`, `mipmap-anydpi-v26/ic_launcher.xml`, `mipmap-*/ic_launcher.png`

---

## Error 11: react-native-screens Incompatible Version

**Error:**
```
Unresolved reference: BaseReactPackage
'createViewManagers' overrides nothing
```

**Cause:** `react-native-screens@3.29.x` was compiled against RN 0.74+ APIs. The `BaseReactPackage` class either moved or the API changed. `react-native-safe-area-context` compiled fine because it uses different (stable) APIs.

**Fix:** Downgraded `react-native-screens` from `^3.29.0` to `3.27.0` (compatible with RN 0.73). Also pinned `react-native-vector-icons` to `10.0.3` for stability.

**Files:** `package.json`

---

## Summary of Key Files Modified

| File | Purpose |
|---|---|
| `package.json` | Removed expo, added RN dev deps, pinned library versions |
| `.github/workflows/build.yml` | CI/CD pipeline with all fixes |
| `android/settings.gradle` | Simplified without RN plugin |
| `android/build.gradle` | Global subproject config (dependency sub, buildConfig, JVM target) |
| `android/app/build.gradle` | Explicit react-android versions, no RN plugin |
| `android/gradlew` + `gradlew.bat` | Gradle wrapper scripts |
| `android/app/src/main/res/` | Icon resources |
| `android/gradle.properties` | Hermes disabled, JSC flavor added |
