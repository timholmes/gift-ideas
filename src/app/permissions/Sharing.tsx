import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Button, Portal, Snackbar, Text, TextInput } from "react-native-paper";
import * as Yup from 'yup';
import { UserContext } from '../AppContext';
import { FirebaseUtils } from '../util/FirebaseUtils';
// import { Sharing } from '../Types';

export function Sharing({route, navigation }: any) {

    const db = FirebaseUtils.getFirestoreDatabase();
    const userContext = useContext(UserContext);
    const [state, setState] = useState({ showError: false, errorMessage: '', mode: "ADD", relative: {
        email: ''
    } })

    // useEffect(() => {
    //     if (route.params?.idea) {
    //         setState({ ...state, idea: route.params.idea, mode: "EDIT"})
    //     }
    // }, [])
    

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(),
        description: Yup.string().required()
    });

    return (
        <View>
            <Formik
                initialValues={ state.relative }
                // validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={async values => {
                    // if (!userContext.userInfo) {
                    //     setState({ ...state, showError: true, errorMessage: 'Error saving, please login again.' })
                    // } else {
                        
                    //     FirebaseUtils.getFirestoreDatabase()

                    //     // let newIdea: Idea = { title: values.title, description: values.description, visibility: 'public' };
                    //     // let sharing: Sharing = { view: { users: [values.email] }}
                    //     try {
                    //         const docRef = await addDoc(collection(db, "users", userContext.userInfo.email, "sharing", "view"), [values.email] );
                    //         // newIdea.id = docRef.id

                    //         // userContext.ideas.push(newIdea);
                    //     } catch (error) {
                    //         setState({ ...state, showError: true, errorMessage: 'Error saving your ideas.' })
                    //         console.error(error);
                    //         return;
                    //     }
                    //     console.log('saving relative');
                    //     navigation.navigate('Home', { refreshContent: true });
                    // }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View style={ styles.container }>
                        <Text style={{ margin: 5 }}>Enter the name of the person you would like to share your ideas with.</Text>
                        <Text style={{ margin: 5 }}>This person can view all of your ideas.</Text>
                        <TextInput
                            style={ styles.container }
                            label="Email"
                            mode="outlined"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {errors.email ? <Text>{errors.email}</Text> : null}
                        <Button mode="contained" style={ styles.container } onPress={handleSubmit as (e?: GestureResponderEvent) => void}>
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


const styles = StyleSheet.create({
    container: {
        margin: 5
    },
  });