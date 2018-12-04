import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, FlatList, Image, TouchableOpacity, SafeAreaView} from 'react-native';
import VideoListItem from "../components/VideoListItem";
import appdata, {FAV_ICON} from '../appdata';

export default class History extends Component {
    constructor(props){
        super(props);
        this.state = {
            videos: [], 
            focus: true,
        }
    }

    async componentDidMount() {
        let videos = await appdata.getHistoryVideos();
        this.setState({videos});
        this.props.navigation.addListener('willFocus', async (route) => { 
            let videos = await appdata.getHistoryVideos();
            this.setState({videos, focus: true});
        });
        this.props.navigation.addListener('willBlur', (route) => { 
            this.setState({focus: false});
        });
    }

    onPressItem = (item) => {
        let {navigate} = this.props.navigation;
        navigate('Player', {videoId: item.id, currentTime: item.currentTime})
    }

    render(){
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <FlatList
                        contentContainerStyle={styles.flatList}
                        data={this.state.videos}
                        renderItem={({item, index})=>(
                            <VideoListItem
                                item={item}
                                onPress={()=>this.onPressItem(item)}
                                focus={this.state.focus}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={0.1}
                        onEndReached={this.onEndReached}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    flatList: {
        paddingVertical: 4,
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    title: {
        fontSize: 18,        
    },

    detail: {
        fontSize: 16,
    },

    titleView: {
        flex: 1,
        marginHorizontal: 8,
    }
});
  