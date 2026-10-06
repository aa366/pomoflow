# Pomoflow

Pomoflow is a mobile-first Pomodoro timer built with Expo and React Native.

## Timer

- Start or pause the countdown, save its current time, and restart the session.
- The pie chart shows elapsed and remaining time. The clock appears below it.
- Choose Focus, Short break, or Long break from the session selector.
- Create a custom session with a name and a duration from 1 to 180 minutes.

Saved time and custom sessions stay in memory while the screen is open. They are not stored across app restarts.

## Run

```bash
npm install
npx expo start
```

## Checks

```bash
npx expo lint
npx tsc --noEmit
```
