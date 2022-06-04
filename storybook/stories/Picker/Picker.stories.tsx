import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Picker from "../src/Picker";
import { Alert } from "react-native";

export default {
  title: "Example/Picker",
  component: Picker,
} as ComponentMeta<typeof Picker>;

const Template: ComponentStory<typeof Picker> = (args) => <Picker {...args} />;

export const WithButton = Template.bind({});

WithButton.storyName = "With button";
WithButton.args = {
  title: "Welcome to my App",
  buttonText: "Sign in",
  hideButton: false,
  onButtonPress: () => Alert.alert("Signed in"),
};

export const WithoutButton = Template.bind({});

WithoutButton.storyName = "Without button";
WithoutButton.args = {
  title: "Welcome to my App",
  buttonText: "Sign in",
  hideButton: true,
  onButtonPress: () => Alert.alert("Signed in"),
};