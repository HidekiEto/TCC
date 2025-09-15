
declare module '@testing-library/react-native';
declare module '@testing-library/jest-native';
declare module 'expo-splash-screen';
declare module 'expo-splash-screen' {
	export function preventAutoHideAsync(): Promise<void>;
	export function hideAsync(): Promise<void>;
}

declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;
declare const afterEach: any;
declare const jest: any;

export {};


import 'react-native';

declare module 'react-native' {
	interface ViewProps {
		className?: string;
	}
	interface TextProps {
		className?: string;
	}
	interface ImageProps {
		className?: string;
	}
	interface ScrollViewProps {
		className?: string;
	}
	interface TouchableOpacityProps {
		className?: string;
	}
}
