import storage from '@react-native-firebase/storage';

export async function getProfileImageUrl(studentRegistrationNumber) {
    const imageUrl = await storage().ref('profile_'+studentRegistrationNumber).getDownloadURL();
    // console.log('getProfileImageUrl', imageUrl);
    return imageUrl;
}