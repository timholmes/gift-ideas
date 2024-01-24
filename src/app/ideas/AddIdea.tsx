import { addDoc, collection } from 'firebase/firestore';
import { Formik } from 'formik';
import { GestureResponderEvent, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as Yup from 'yup';
import { FirebaseUtils } from '../util/FirebaseUtils';
import { UserContext } from '../AppContext';
import { useContext } from 'react';

export function AddIdea({ navigation }: any) {

    const db = FirebaseUtils.getFirestoreDatabase();
    const userContext = useContext(UserContext);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required()
    });

    return (
        <Formik
            initialValues={{ title: '', description: '' }}
            validationSchema={validationSchema}
            onSubmit={async values => {
                FirebaseUtils.getFirestoreDatabase()

                try {
                    await addDoc(collection(db, "users", userContext.userInfo.email, "ideas"), { title: values.title, description: values.description });
                } catch (error) {
                    // TODO: show user message
                    console.error(error);
                }

                navigation.navigate('MyIdeas');
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
    )

}