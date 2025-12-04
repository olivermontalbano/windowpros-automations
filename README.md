# windowpros-automations


Quick Commands

```
# Start emulator
cd functions && yarn build
cd .. && firebase emulators:start --only functions

# Deploy secret to Firebase production
firebase functions:secrets:set TOKEN_NAME

# Deploy cloud functions to Firebase production
cd functions && yarn build
cd .. && firebase deploy --only functions

```