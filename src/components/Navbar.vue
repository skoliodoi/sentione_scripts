<template>
	<div
		style="display: flex; justify-content: space-around; background: whitesmoke"
	>
		<img
			class="ui small image"
			src="../assets/sentione-logo.png"
			style="padding: 15px"
		/>
		<div
			style="
        flex: 0.6;
				display: flex;
				justify-content: start;
				align-items: center;
			"
		>
			<div class="ui top left vertical dropdown button blue" ref="logout">
				<div>Hi, {{ nameToDisplay.firstName }}!</div>
				<div class="menu">
					<div class="item" @click="logout">Log out</div>
				</div>
			</div>
		</div>
		<div
    style="flex:1; display: flex; flex-direction: column; justify-content: center; align-items: center;">
				<div><strong>Client scripts read so far: {{scenarioCount.clientCount}}</strong> </div>
        <div style="height: 10px"></div>
				<div><strong>Agent scripts read so far: {{scenarioCount.agentCount}}</strong> </div>
		</div>
		<div
			class="ui attached menu"
			style="flex: 1; border: none; background: whitesmoke"
		>
			<div class="item center menu">
				<div class="ui buttons">
					<button
						class="ui button"
						:class="{
							active: checkAgent.isAgent,
							positive: checkAgent.isAgent,
						}"
						@click="
							changeClass(true);
							setSpeakerType(checkAgent.isAgent);
						"
					>
						Agent
					</button>
					<!-- <div class="or"></div> -->
					<button
						v-if="scenarioCount.clientCount < 100"
						class="ui button"
						:class="{
							active: !checkAgent.isAgent,
							positive: !checkAgent.isAgent,
						}"
						@click="
							changeClass(false);
							setSpeakerType(checkAgent.isAgent);
						"
					>
						Client
					</button>
					<div v-else ref="popupClient" @mouseover="displayPopUp('Client')">
						<button class="ui red basic disabled button">Oops!</button>
					</div>
				</div>
			</div>
		</div>
		<div style="flex: 3; display: flex; align-items: center">
			<div
				style="
					width: 100%;
					display: flex;
					justify-content: space-around;
					align-items: center;
				"
			>
				<group-selector
					@groupSelected="checkGroup"
					:label="'Select scenario group'"
					:data="scriptGroups"
					ref="group"
				></group-selector>
				<script-selector
					@scriptSelected="checkScript"
					:label="'Select scenario'"
					:data="scripts"
					ref="script"
				></script-selector>
				<button
					class="ui blue button"
					:class="{ loading: loadingScript }"
					@click="checkAndSendScript"
				>
					Select
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import config from "../config";

	import groupSelector from "./GroupSelector.vue";
	import scriptSelector from "./ScriptSelector.vue";
	export default {
		props: ["listData", "nameToDisplay", "scenarioCount"],
		components: {
			groupSelector,
			scriptSelector,
		},
		mounted() {
			this.setSpeakerType(this.checkAgent.isAgent);
			$(this.$refs.logout).dropdown();
		},
		data() {
			return {
				loadingScript: false,
				chosenGroup: "",
				chosenScript: "",
				isAgent: true,
				speakerType: "",
			};
		},
		computed: {
			checkAgent() {
				if (
					this.isAgent == true ||
					this.scenarioCount.clientCount > 100
				) {
					return {
						blockAgent: false,
						isAgent: true,
					};
				} else {
					return {
						blockAgent: true,
						isAgent: false,
					};
				}
			},
			scriptGroups() {
				let groupList = [];
				for (const each of this.listData) {
					if (each.caller_type == this.speakerType) {
						groupList.push(each.script_group);
					}
				}
				const uniqueValues = new Set(groupList);
				return uniqueValues;
			},
			scripts() {
				let scriptList = [];
				for (const each of this.listData) {
					if (
						each.script_group == this.chosenGroup &&
						each.caller_type == this.speakerType &&
						each.script_finished != 1
					) {
						scriptList.push(each.script_name);
					}
				}
				return scriptList;
			},
		},
		methods: {
			async blockScript() {
				if (this.chosenScript != "") {
					await axios
						.get(`${config.apiBaseUrl}/taken_scripts/insert`, {
							headers: {
								Authorization: this.nameToDisplay.token,
							},
							params: {
								user_id: this.nameToDisplay.userId,
								last_name: this.nameToDisplay.lastName,
								first_name: this.nameToDisplay.firstName,
								script_name: this.chosenScript,
							},
						})
						.catch((err) => {
							console.log(err);
							return;
						});
				}
			},
			async updateTakenScripts() {
				// console.log('Working');
				if (this.chosenScript != "") {
					await axios.get(`${config.apiBaseUrl}/taken_scripts/update`, {
						headers: {
							Authorization: this.nameToDisplay.token,
						},
						params: {
							user_id: this.nameToDisplay.userId,
							last_name: this.nameToDisplay.lastName,
							first_name: this.nameToDisplay.firstName,
							script_name: this.chosenScript,
						},
					});
				}
			},
			clearScript() {
				axios.get(`${config.apiBaseUrl}/taken_scripts/delete`, {
					headers: {
						Authorization: this.nameToDisplay.token,
					},
					params: {
						user_id: this.nameToDisplay.userId,
					},
				});
			},
			displayPopUp(val) {
				if (val == "Agent") {
					$(this.$refs.popupAgent)
						.popup({
							title: `Sorry, no more ${val}'s scripts for you!`,
							content: `It seems you read too many ${val}'s scripts already. Try another option!`,
						})
						.popup("show");
				} else {
					$(this.$refs.popupClient)
						.popup({
							title: `Sorry, no more ${val}'s scripts for you!`,
							content: `It seems you read too many ${val}'s scripts already. Try another option!`,
						})
						.popup("show");
				}
			},
			logout() {
				this.clearScript();
				this.$router.replace("/");
				localStorage.removeItem("firstName");
				localStorage.removeItem("lastName");
				localStorage.removeItem("userId");
				localStorage.removeItem("loggedIn");
				localStorage.removeItem("initAgentCount");
				localStorage.removeItem("initClientCount");
			},

			setSpeakerType(e) {
				if (e == true) {
					this.speakerType = "AGENT";
				} else {
					this.speakerType = "CLIENT";
				}
			},
			checkGroup(e) {
				this.chosenGroup = e;
			},
			checkScript(e) {
				this.chosenScript = e;
			},
			async checkAndSendScript() {
				this.loadingScript = true;
				this.clearSelection();
				const res = axios
					.get(`${config.apiBaseUrl}/taken_scripts`, {
						headers: {
							Authorization: this.nameToDisplay.token,
						},
					})
					.catch((err) => {
						console.log(err.response.data);
						return;
					});
				const response = (await res).data;
				let findName = response.find((o) => o.script_name == this.chosenScript);
				let findId = response.find((o) => o.user_id == this.nameToDisplay.userId);
				if (findName && !findId) {
					$("body").toast({
						message: `Sorry, this script is currently in use by ${findName.first_name} ${findName.last_name}. Try a different script!`,
						displayTime: 0,
						class: "red",
						classActions: "centered", // you can also use 'center aligned'
						actions: [
							{
								text: "Ok",
								class: "white",
								click: () => this.clearSelection(),
							},
						],
					});
				} else if (findId) {
					this.updateTakenScripts();
					this.sendScript();
				} else {
					this.blockScript();
					this.sendScript();
				}
				// eslint-disable-line no-mixed-spaces-and-tabs

				this.loadingScript = false;
			},
			sendScript() {
				// this.$emit("clearLists");
				this.$emit("script", this.chosenScript);
				this.chosenScript = "";
			},
			changeClass(val) {
				this.isAgent = val;
				this.chosenScript = "";
				this.clearSelection();
			},
			clearSelection() {
				// $(this.$refs.child.$refs.selector).dropdown("clear");
				$(this.$refs.script.$refs.selector).dropdown("clear");
				$(this.$refs.group.$refs.selector).dropdown("clear");
			},
		},
	};
</script>

<style>
	.ui.positive.active.button,
	.ui.positive.button .active.button:active,
	.ui.positive.buttons .active.button,
	.ui.positive.buttons .active.button:active {
		background-color: #2185d0;
		color: #fff;
		text-shadow: none;
	}
</style>