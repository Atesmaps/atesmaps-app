# "Build notes: Issue with @react-native-community/datetimepicker"

## 🛠️ iOS Troubleshooting: Xcode 16/18 Compilation Fixes

This section documents necessary patches for older, widely used React Native libraries that fail to compile under strict C++ standards enforced by the latest Xcode 16 / iOS 18 SDKs. These patches are required if we cannot upgrade the main React Native version.
---

### 1. Fix: `@react-native-community/datetimepicker`

This patch resolves the `CompileC ... RNDateTimePickerShadowView.m` failure.

**Prerequisites**

Ensure `patch-package` is installed as a development dependency:


npm install patch-package postinstall-postinstall --save-dev


### 2. Manually Apply the Code Fix

Open the file: node_modules/@react-native-community/datetimepicker/ios/RNDateTimePickerShadowView.m

Locate the line where YGNodeSetMeasureFunc is called (usually inside the - (instancetype)init method) and apply the explicit cast:


// BEFORE (Fails Compilation in Xcode 16):
// YGNodeSetMeasureFunc(self.yogaNode, RNDateTimePickerShadowViewMeasure);
// AFTER (The required fix):
YGNodeSetMeasureFunc(self.yogaNode, (YGMeasureFunc)RNDateTimePickerShadowViewMeasure);

### Step 1.2: Generate the Patch
Save the changes and run the following command in the project root:


npx patch-package @react-native-community/datetimepicker

# 1. Clean Xcode cache

rm -rf ~/Library/Developer/Xcode/DerivedData

# 2. Go to iOS folder

cd ios

# 3. Destroy Pods and Lockfile

rm -rf Pods
rm Podfile.lock

# 4. Reinstall Pods

pod install --repo-update
cd ..

