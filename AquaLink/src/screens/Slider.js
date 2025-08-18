import Slider from 'react-native-app-intro-slider';
import { StyleSheet } from 'react-native';

import renderSlides from '../components/RenderSlides';

import Title from '../components/Title';

const slides = [
    {
        key: '1',
        backgroundColor: '#3498db',
        component: <Title/>
        
    },
    {
        key: '2',
        component: <Title/>,
        backgroundColor: '#3498db',
        text: 'A garrafa inteligente 100% brasileira.',
        image: require('../assets/bottle.png')
    },
    {
        key: '3',
        component: <Title/>,
        text: 'Muito menos consumo.',
        backgroundColor: '#3498db',
        topContent: true
    },
    {
        key: '4',
        component: <Title/>,
        text: 'Muito mais praticidade.',
        backgroundColor: '#3498db',
        topContent: true

    },
];

export default function Slides({ onDone }) {
    return (
        <Slider
            renderItem={renderSlides}
            data={slides}
            onDone={onDone}
            dotStyle={{
                marginBottom: 100,
                backgroundColor: '#084F8C',
                width: 15,
                height: 15,
                borderRadius: 20
            }}
            activeDotStyle={{
                backgroundColor: 'white',
                marginBottom: 110,
                width: 15,
                height: 15,
                borderRadius: 20
            }}        

        />
    );
}