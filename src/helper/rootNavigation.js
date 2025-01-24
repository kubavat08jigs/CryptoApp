import { createRef } from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = createRef();

export const navigate = (name, params, shouldReplace = false) => {
    if (shouldReplace) {
        navigationRef?.current?.goBack();
        navigationRef?.current?.navigate(name, params);
    } else {
        navigationRef?.current?.navigate(name, params);
    }
};
export const goBack = () => navigationRef?.current?.goBack();

export const resetNavigationStack = (name, params) => {
    let routeObj = { name: name };
    if (params) {
        routeObj.params = params;
    }
    navigationRef?.current?.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [routeObj],
        })
    );
}
