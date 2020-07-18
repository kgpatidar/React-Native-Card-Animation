import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";

const DATA = [
  {
    id: 1,
    text: "Card #1",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Avatar_Aang.png/220px-Avatar_Aang.png"
  },
  {
    id: 2,
    text: "Card #2",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Sokka.png/220px-Sokka.png"
  },
  {
    id: 3,
    text: "Card #3",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Avatar_Aang.png/220px-Avatar_Aang.png"
  },
  {
    id: 4,
    text: "Card #4",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Sokka.png/220px-Sokka.png"
  },
  {
    id: 5,
    text: "Card #5",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Avatar_Aang.png/220px-Avatar_Aang.png"
  },
  {
    id: 6,
    text: "Card #6",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Sokka.png/220px-Sokka.png"
  },
  {
    id: 7,
    text: "Card #7",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Avatar_Aang.png/220px-Avatar_Aang.png"
  },
  {
    id: 8,
    text: "Card #8",
    uri:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Sokka.png/220px-Sokka.png"
  }
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.4 * SCREEN_WIDTH;

class Card extends Component {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceOutOfBoxSwiping(SCREEN_WIDTH * 1.5);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceOutOfBoxSwiping(-SCREEN_WIDTH * 1.5);
        } else {
          this.resetPosition(0, 0);
        }
      }
    });

    this.state = { panResponder, position, index: 0, opacityValue: 1 };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  resetPosition(x, y) {
    Animated.spring(this.state.position, {
      toValue: { x: x, y: y }
    }).start();
  }

  forceOutOfBoxSwiping(x) {
    Animated.timing(this.state.position, {
      toValue: { x: x, y: 0 },
      duration: 250
    }).start(() => {
      this.onSwipeComplete();
    });
  }

  onSwipeComplete() {
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0],
      outputRange: [0.2, 1, 0.2]
    });

    return {
      ...position.getLayout(),
      transform: [{ scale: rotate }]
    };
  }

  stylingOpacity() {
    const { position } = this.state;
    const opVal = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 1.2, 0, SCREEN_WIDTH / 1.2],
      outputRange: [0.2, 1, 0.2]
    });
    return opVal;
  }

  renderCard() {
    if (this.state.index >= DATA.length) {
      return <Text style={{ textAlign: "center" }}>No Item Left</Text>;
    }

    return DATA.map((item, i) => {
      if (i < this.state.index) {
        return null;
      }

      return i === this.state.index ? (
        <Animated.View
          key={item.id}
          style={[
            (styles.cardStyle, this.getCardStyle()),
            { opacity: this.stylingOpacity() }
          ]}
          {...this.state.panResponder.panHandlers}
        >
          {this.cardStructure(item.uri, item.text, item.id)}
        </Animated.View>
      ) : (
        <Animated.View
          style={[styles.cardStyle, { top: 10 * i }]}
          key={item.id}
        >
          {this.cardStructure(item.uri, item.text, item.id)}
        </Animated.View>
      );
    }).reverse();
  }

  cardStructure(suri, cardtext, key) {
    return (
      <View style={styles.cardContainer} key={key}>
        <Image source={{ uri: suri }} style={styles.cardImage} />
        <Text style={styles.cardText}>{cardtext}</Text>
        <TouchableOpacity style={styles.cardButton}>
          <Text style={styles.CardButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return <View>{this.renderCard()}</View>;
  }
}

export default Card;

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 0
  },
  movingCard: {
    opacity: 0.5
  },
  cardContainer: {
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
    backgroundColor: "#fff"
  },
  cardImage: {
    height: 150,
    width: "100%",
    resizeMode: "contain",
    margin: 10
  },
  cardText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#01579b"
  },
  cardButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#039be5",
    height: 30,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    marginTop: 5
  },
  CardButtonText: {
    color: "white"
  }
});
