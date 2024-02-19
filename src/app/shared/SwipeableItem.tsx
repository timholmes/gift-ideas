import { DeviceEventEmitter, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { List } from "react-native-paper";

export enum SwipeableItemEvents {
    DELETE_PRESS = "event.deletePress",
    ITEM_PRESS = "event.itemPress"
}

// local only to this widget
export type Props = {
    id: string | undefined,
    title: string,
    description: string,
    icon: string,    // icon of one of the following names from material community icons: https://pictogrammers.com/library/mdi/
    data: any
}

export function SwipeableItem({ id, title, description, icon, data }: Props) {

    const rightSwipeActions = (progressAnimatedValue: any, dragAnimatedValue: any, swipeable: Swipeable) => {
        return (
            <View
                style={{
                    backgroundColor: '#ff8303',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    onPress={() => {
                        DeviceEventEmitter.emit(SwipeableItemEvents.DELETE_PRESS, swipeable);
                    }}
                    style={{
                        color: '#1b1a17',
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                >
                    Delete
                </Text>
            </View>
        );
    };


    return (
        <Swipeable key={id}
                    id={id}
                    renderRightActions={rightSwipeActions}
        >
            <List.Item
                key={id}
                title={title}
                description={description}
                left={props => <List.Icon {...props} icon={icon || "" } />}
                id={id}
                onPress={() => DeviceEventEmitter.emit(SwipeableItemEvents.ITEM_PRESS, data)}
            />
        </Swipeable>
    )
}