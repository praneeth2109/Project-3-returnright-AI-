# Research Notes - variables.gradle

## Current State
The `variables.gradle` file defines several Android SDK and library versions used across the project.

## Findings
1. **SDK Versions**:
   - `compileSdkVersion` and `targetSdkVersion` are set to **36**.
   - Research indicates that **Android 17 (API Level 37)** was released as stable on **June 16, 2026**.
   - Targeting API 37 is recommended for the latest stable features and security.
   - API 36 is still valid but no longer the latest stable.

2. **Library Versions**:
   - Several libraries are outdated according to `version_lookup` and web search results (July 2026 context):
     - `androidxActivityVersion`: 1.11.0 (Latest stable: **1.13.0**)
     - `androidxCoreVersion`: 1.17.0 (Latest stable: **1.19.0**)
     - `androidxWebkitVersion`: 1.14.0 (Latest stable: **1.16.0**)
   - Other versions (`appcompat`, `fragment`, `splashscreen`, `junit`, `espresso`) appear to be up to date.

3. **Cordova Android**:
   - `cordovaAndroidVersion` is set to **14.0.1**. This seems appropriate for 2026.

4. **IDE Warnings**:
   - The IDE likely shows "Outdated dependency" warnings for the libraries mentioned above.
   - It might also suggest targeting the latest stable API (37).

## Proposed Fixes
- Update `compileSdkVersion` and `targetSdkVersion` to **37**.
- Update `androidxActivityVersion` to **1.13.0**.
- Update `androidxCoreVersion` to **1.19.0**.
- Update `androidxWebkitVersion` to **1.16.0**.
