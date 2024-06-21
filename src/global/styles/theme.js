
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default {
    colors: {
        background: '#efefef',
        text: '#111111',
        primary: 'rgb(237,28,36)',
        primaryOpacity: 'rgba(237,28,36,.7)',
        secondary: 'rgb(42,39,115)',
        secondaryOpacity: 'rgba(42,39,115,.7)',
        gray: 'rgb(80,80,80)',
        grayOpacity2: 'rgba(80,80,80,.4)',
        grayOpacity: 'rgba(80,80,80,.2)',
        Absent: 'rgb(237,28,36)',
        Sick: 'rgb(28,237,112)',
        Present: 'rgb(42,39,115)',
        Transfer: 'rgb(237,164,28)',
        Vacation: 'rgb(139,28,237)',
        Halfpresent: 'rgb(237,139,28)'
    },
    icons: {
        Sick: <MaterialIcons name="sick" style={{ color: 'rgb(28,237,112)', fontSize: 22 }} />,
        Absent: <FontAwesome style={{ color: 'rgb(237,28,36)', fontSize: 22 }} name="times" />,
        Present: <FontAwesome style={{ color: 'rgb(42,39,115)', fontSize: 22 }} name="check" />,
        Transfer: <FontAwesome style={{ color: 'rgb(237,164,28)', fontSize: 22 }} name="exchange" />,
        Vacation: <FontAwesome style={{ color: 'rgb(139,28,237)', fontSize: 22 }} name="plane" />,
        Halfpresent: <FontAwesome style={{ color: 'rgb(237,139,28)', fontSize: 22 }} name="check" />
    },
    fonts: {
        regular: 'Roboto_400Regular',
        medium: 'Roboto_500Medium',
        bold: 'Roboto_700Bold'
    },
    buttons: {
        primaryButton: {
            backgroundColor: "#FFFFFF",
            height: 56,
            width: '80%',
            borderRadius: 32,
            marginTop: 64,
            alignItems: "center",
            justifyContent: 'center'
        },
        secondaryButton: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: '#27306c',
            height: 56,
            width: '80%',
            borderRadius: 32,
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center'
        },
        secondaryButtonSimple: {
            alignItems: "center",
            backgroundColor: "transparent",
            height: 48,
            paddingHorizontal: 16,
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }
}
