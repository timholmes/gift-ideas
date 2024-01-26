import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { GestureResponderEvent, View } from "react-native";
import { Button, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import * as Yup from 'yup';
import { Idea, UserContext } from '../AppContext';
import { FirebaseUtils } from '../util/FirebaseUtils';

export function AddIdea({ navigation }: any) {

    const db = FirebaseUtils.getFirestoreDatabase();
    const userContext = useContext(UserContext);
    const [state, setState] = useState({ showError: false, errorMessage: '' })

    useEffect(() => {
        // navigation.navigate('MyIdeas', { refreshContent: true });
    }, [])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required()
    });

    return (
        <View>
            <Formik
                initialValues={{ title: '', description: '' }}
                // validationSchema={validationSchema}
                onSubmit={async values => {
                    console.log('submit');
                    navigation.navigate('MyIdeas', { refreshContent: true });
                    return;
                    // if (!userContext.userInfo) {
                    //     setState({ showError: true, errorMessage: 'Error saving your ideas.  Please login again.' })
                    // } else {
                        
                    //     FirebaseUtils.getFirestoreDatabase()

                    //     let newIdea: Idea = { title: values.title, description: values.description };
                    //     try {
                    //         await addDoc(collection(db, "users", userContext.userInfo.email, "ideas"), newIdea);

                    //         userContext.ideas.push(newIdea);
                    //     } catch (error) {
                    //         setState({ showError: true, errorMessage: 'Error saving your ideas.' })
                    //         console.error(error);
                    //         return;
                    //     }

                    //     navigation.navigate('MyIdeas', { refreshContent: true });
                    // }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View style={{ margin: 10 }}>
                        <TextInput
                            style={{ margin: 5 }}
                            label="Title"
                            mode="outlined"
                            onChangeText={handleChange('title')}
                            onBlur={handleBlur('title')}
                            value={values.title}
                        />
                        {errors.title ? <Text>{errors.title}</Text> : null}
                        <TextInput
                            style={{ margin: 5, height: 80 }}
                            label="Description"
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                        />
                        <Button mode="contained" onPress={handleSubmit as (e?: GestureResponderEvent) => void}>
                            Submit
                        </Button>
                    </View>
                )}
            </Formik>
            <Portal>
                <Snackbar
                    visible={state.showError}
                    onDismiss={() => { setState({ ...state, showError: false }) }}
                    duration={30000}
                >
                    {state.errorMessage}
                </Snackbar>
            </Portal>
        </View>
    )

}