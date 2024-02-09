import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { GestureResponderEvent, View } from "react-native";
import { Button, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import * as Yup from 'yup';
import { UserContext } from '../AppContext';
import { FirebaseUtils } from '../util/FirebaseUtils';
import { Idea } from '../Types';

export function AddIdea({route, navigation }: any) {

    const db = FirebaseUtils.getFirestoreDatabase();
    const userContext = useContext(UserContext);
    const [state, setState] = useState({ showError: false, errorMessage: '', mode: "ADD", idea: {
        id: '',
        title: '',
        description: ''
    } })

    useEffect(() => {
        if (route.params?.idea) {
            setState({ ...state, idea: route.params.idea, mode: "EDIT"})
        }
    }, [])

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required()
    });

    return (
        <View>
            <Formik
                initialValues={ state.idea }
                // validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={async values => {
                    if (!userContext.userInfo) {
                        setState({ ...state, showError: true, errorMessage: 'Error saving your ideas.  Please login again.' })
                    } else {
                        
                        FirebaseUtils.getFirestoreDatabase()

                        let newIdea: Idea = { title: values.title, description: values.description };
                        try {
                            const docRef = await addDoc(collection(db, "users", userContext.userInfo.email, "ideas"), newIdea);
                            newIdea.id = docRef.id

                            userContext.ideas.push(newIdea);
                        } catch (error) {
                            setState({ ...state, showError: true, errorMessage: 'Error saving your ideas.' })
                            console.error(error);
                            return;
                        }

                        navigation.navigate('MyIdeas', { refreshContent: true });
                    }
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