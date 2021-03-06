import React, { Component } from "react";
import { ActivityIndicator, View } from "react-native";

import Question from "./screens/Question";
import Waiting from "./screens/Waiting";
import Welcome from "./screens/Welcome";
import EnablePush from "./screens/EnablePush";

import Navigator from "./components/Navigator";
import Container from "./components/Container";

import * as UserData from "./util/UserData";
import * as QuestionData from "./util/QuestionData";
import { loadFonts } from "./util/fonts";
import { PushNotificationManager } from "./util/pushNotifications";

class App extends Component {
  state = {
    fontsReady: false
  };

  componentDidMount() {
    loadFonts().then(() => this.setState({ fontsReady: true }));
  }

  render() {
    if (
      !this.props.user.ready ||
      !this.props.question.ready ||
      !this.state.fontsReady
    ) {
      return (
        <Container padding>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Container>
      );
    }

    const initialSceneName = this.props.user.onboardingComplete
      ? "Question"
      : "Welcome";
    return (
      <Container padding>
        <Navigator
          ref={ref => (this.navigator = ref)}
          initialSceneName={initialSceneName}
          scenes={{
            Welcome: { component: Welcome },
            Question: { component: Question },
            Waiting: { component: Waiting },
            EnablePush: { component: EnablePush }
          }}
        />
      </Container>
    );
  }
}

class WrappedApp extends Component {
  handlePushNotification = data => {
    if (data.questions && data.nextQuestionTime) {
      this.props.question.setQuestions(
        {
          data: {
            questions: data.questions,
            nextQuestionTime: data.nextQuestionTime
          }
        },
        true
      );
    }
  };

  render() {
    return (
      <PushNotificationManager
        onPushNotificationSelected={this.handlePushNotification}
      >
        <App {...this.props} />
      </PushNotificationManager>
    );
  }
}

export default () => (
  <UserData.Provider>
    <QuestionData.Provider>
      <QuestionData.Consumer>
        {question => (
          <UserData.Consumer>
            {user => <WrappedApp question={question} user={user} />}
          </UserData.Consumer>
        )}
      </QuestionData.Consumer>
    </QuestionData.Provider>
  </UserData.Provider>
);
