interface ScreenDetailed extends Screen {
  readonly availLeft: number;
  readonly availTop: number;
  readonly isPrimary: boolean;
  readonly label: string;
}

interface Screen {
  readonly isExtended?: boolean;
}

interface ScreenDetails {
  readonly screens: readonly ScreenDetailed[];
  readonly currentScreen: ScreenDetailed;
}

interface Window {
  getScreenDetails?: () => Promise<ScreenDetails>;
}
