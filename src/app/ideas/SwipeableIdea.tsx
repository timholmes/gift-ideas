import { useEffect } from "react";
import { DeviceEventEmitter, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { List } from "react-native-paper";
import { Idea } from "../Types";

export enum SwipeableIdeaEvents {
    DELETE_PRESS = "event.deletePress",
    ITEM_PRESS = "event.itemPress"
}

// local only to this widget
export type Props = {
    idea: Idea
}

export function SwipeableIdea({ idea }: Props) {

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
                        DeviceEventEmitter.emit(SwipeableIdeaEvents.DELETE_PRESS, swipeable);
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
        <Swipeable key={idea.id}
                    id={idea.id}
                    renderRightActions={rightSwipeActions}
        >
            <List.Item
                key={idea.id}
                title={idea.title}
                description={idea.description || '-no description-'}
                left={props => <List.Icon {...props} icon="lightbulb" />}
                id={idea.id}
                onPress={() => DeviceEventEmitter.emit(SwipeableIdeaEvents.ITEM_PRESS, idea)}
            />
        </Swipeable>
    )
}