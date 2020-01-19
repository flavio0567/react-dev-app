import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

function Main( { navigation }) {
    // estado para armzenar os devs
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

        if (granted) {
            const { coords } = await getCurrentPositionAsync({
                enableHighAccuracy: true,
            });
    
            const { latitude, longitude} = coords;

            setCurrentRegion({
                latitude,
                longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
            })
        }
    }

        loadInitialPosition();
    }, [])

    // carregar os users
    async function loadDevs() {
        const { latitude, longitude} = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: 'ReactJS'
            }
        });

        console.log(response.data.devs);

        setDevs(response.data.devs);

    }
    // executa qdo o user mudar a sua localizacao atraves do onRegionChangeComplete
    function handleRegionChanged(region) {
        console.log(region);
        setCurrentRegion(region);
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
        <MapView 
            onRegionChangeComplete={handleRegionChanged}
            initialRegion={currentRegion} 
            style={ styles.map }>

            <Marker 
                coordinate={ { 
                    latitude: 37.6974118, 
                    longitude: -121.8779478 
                }} 
            >
                <Image 
                    style={styles.avatar} 
                    source={ { uri: 'https://avatars2.githubusercontent.com/u/30816078?s=460&v=4' } } 
                />

                <Callout onPress={ () => {
                    navigation.navigate('Profile', { github_username: 'flavio0567' });
                } }>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>Flavio Rocha</Text>
                        <Text style={styles.devBio}>I love coding in a high-paced and challenging environment with an emphasis on using best practices to develop high quality software. I've worked on a wide range</Text>
                        <Text style={styles.devTechs}>ReactJS, React Native, Node.js</Text>
                    </View>

                </Callout>
            </Marker>
        </MapView>
        <View style={styles.searchForm}>
            <TextInput
            style={styles.searchInput}
            placeholder="Get Devs by Techs..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            />

            <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                <MaterialIcons name="flight-takeoff" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>

        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    devBio: {
        color: '#666',
        marginTop: 5,
    },
    devTech: {
        marginTop: 5,
    },
    searchForm: {
        position: 'absolute',
        // bottom: 20,
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        textShadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },

})

export default Main;