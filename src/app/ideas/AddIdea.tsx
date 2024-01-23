import { Formik } from 'formik';
import { GestureResponderEvent, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import * as Yup from 'yup';

export function AddIdea({ navigation }: any) {

    const validationSchema = Yup.object().shape({
        title: Yup.string().required()
    });

    return (
        <Formik
            initialValues={{ title: '' }}
            validationSchema={validationSchema}
            onSubmit={values => console.log(values)}
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
                    />
                    <Button mode="contained" onPress={handleSubmit as (e?: GestureResponderEvent) => void}>
                        Submit
                    </Button>
                </View>
            )}
        </Formik>
    )

}