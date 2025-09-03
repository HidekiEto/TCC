import { useEffect, useState } from "react";
import * as Font from "expo-font";

export function useAppFonts(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      let SplashScreen: any = null;
      try {
        // use require to avoid TypeScript static resolution issues in environments
        // where expo-splash-screen isn't installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        SplashScreen = require("expo-splash-screen");
        if (SplashScreen && SplashScreen.preventAutoHideAsync) {
          await SplashScreen.preventAutoHideAsync();
        }
      } catch (e) {
        SplashScreen = null;
      }

      try {
        await Font.loadAsync({
          LatoRegular: require("../assets/fonts/Lato-Regular.ttf"),
          PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
          PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
          PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
          RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
        });
        if (mounted) setLoaded(true);
        if (SplashScreen?.hideAsync) {
          try { await SplashScreen.hideAsync(); } catch {}
        }
      } catch (e) {
        console.error("Erro carregando fonts:", e);
        if (mounted) setLoaded(true);
        if (SplashScreen?.hideAsync) {
          try { await SplashScreen.hideAsync(); } catch {}
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  return loaded;
}