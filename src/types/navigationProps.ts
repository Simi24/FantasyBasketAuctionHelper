type HandleNavigationFunction = (route: string) => void;

export interface NavProps {
    handleNavigation: HandleNavigationFunction;
}