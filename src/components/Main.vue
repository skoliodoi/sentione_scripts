<template>
	<div class="containbox">
		<div>
			<navbar
				@script="displayScript"
				@clearLists="clearChoices"
				:listData="serverData"
				:nameToDisplay="loggedUserData"
				:scenarioCount="doneScriptCount"
				ref="navbar"
			></navbar>
		</div>
		<div v-if="isLoading">
			<div class="ui active dimmer">
				<div class="ui indeterminate text loader">Loading scripts...</div>
			</div>
		</div>
		<div style="display: flex; height: 100%">
			<div class="box-2">
				<my-content
					@reloadData="reloadData"
					:scriptData="scriptData"
					:savingData="isSaving"
					:isLoading="isLoadingScript"
					v-if="scriptChosen"
					:key="mainViewKey"
				></my-content>
				<!-- <div
				v-else-if="scriptChosen == 'B'"
				style="background: red; height: 100%"
			>
				Nada
			</div> -->
				<div
					v-else
					style="
						background: whitesmoke;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
					"
				>
					<div v-if="!isLoadingScript" class="ui card">
						<div class="image" style="background: white">
							<img src="../assets/no-data.png" />
						</div>
						<div class="content" style="text-align: center">
							<div class="header">Nothing to see here!</div>

							<div class="description">
								Choose a script from the list on the top of the page.
							</div>
						</div>
					</div>
					<div
						v-else
						class="ui active massive centered blue double inline loader"
					></div>
				</div>
			</div>
			<div
				style="
					border-top: 1px solid grey;
					padding: 25px;
					width: 15%;
					height: 100%;
					overflow-y: auto;
					background: whitesmoke;
				"
			>
				<div style="height: 550px">
					<h2 class="ui header" style="text-align: center">Active users:</h2>
					<div v-if="takenScripts != ''">
						<div
							style="
								display: flex;
								flex-direction: column;
								align-items: space-between;
								margin-top: 10px;
								word-wrap: break-word;
							"
							v-for="each in takenScripts"
							:key="each.user_id"
						>
							<b>{{ each.first_name }} {{ each.last_name }}</b> is currently in
							<b>{{ each.script_name }}</b>
						</div>
					</div>
					<div v-else style="text-align: center">No active users detected!</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	const { DateTime } = require("luxon");

	import Navbar from "./Navbar.vue";
	import Content from "./Content.vue";

	export default {
		props: ["userData"],
		data() {
			return {
				doneScriptCount: {
					agentCount: 0,
					clientCount: 0,
				},
				isLoading: false,
				isLoadingScript: false,
				isSaving: false,
				loggedUserData: {
					firstName: localStorage.getItem("firstName"),
					lastName: localStorage.getItem("lastName"),
					userId: localStorage.getItem("userId"),
				},
				takenScripts: {},
				serverData: [],
				scriptText: "",
				scriptTitles: [],
				scriptData: {},
				callerType: "",
				scriptChosen: false,
				mainViewKey: 0,
				timeDate: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT),
			};
		},

		mounted() {
			this.getData(true);
			window.addEventListener("beforeunload", this.logout);
		},
		methods: {
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
			async checkTakenScripts() {
				await this.updateAndPullTakenScripts();
				let isLoading = false;
				const update = async () => {
					if (!isLoading) {
						isLoading = true;
						await this.updateAndPullTakenScripts();
						isLoading = false;
					}
				};
				setInterval(() => {
					update();
					console.log("Ping!");
				}, 5000);
			},
			async updateAndPullTakenScripts() {
				const res = axios.get("http://127.0.0.1:8000/taken_scripts", {
					params: {
						user_id: this.loggedUserData.userId,
					},
				});
				const response = (await res).data;
				this.takenScripts = response;
			},
			clearScript() {
				axios.post("http://127.0.0.1:8000/taken_scripts/delete", {
					user_id: this.loggedUserData.userId,
				});
			},
			getInitAgentCount() {
				let getItem = parseInt(localStorage.getItem("initAgentCount"));
				getItem && getItem != undefined
					? (this.doneScriptCount.agentCount = getItem)
					: (this.doneScriptCount.agentCount = 0);
			},
			getInitClientCount() {
				let getItem = parseInt(localStorage.getItem("initClientCount"));
				getItem && getItem != undefined
					? (this.doneScriptCount.clientCount = getItem)
					: (this.doneScriptCount.clientCount = 0);
			},
			async countScenarios() {
				const res = axios.get("http://127.0.0.1:8000/finished");
				const response = (await res).data;
				this.getInitAgentCount();
				this.getInitClientCount();
				let countAgents = 0;
				let countClients = 0;
				for (const each of response) {
					if (
						each.caller_type == "AGENT" &&
						each.user_id == this.loggedUserData.userId
					) {
						countAgents += 1;
					}
					console.log(countAgents);
					if (
						each.caller_type == "CLIENT" &&
						each.user_id == this.loggedUserData.userId
					) {
						countClients += 1;
					}
				}
				this.doneScriptCount.agentCount =
					this.doneScriptCount.agentCount + countAgents;
				this.doneScriptCount.clientCount += countClients;
				console.log(
					`Agent count: ${this.doneScriptCount.agentCount}. Client count: ${this.doneScriptCount.clientCount}.`
				);
			},
			clearChoices() {
				this.clearScript();
				$(this.$refs.navbar.$refs.group.$refs.selector).dropdown("clear");
				$(this.$refs.navbar.$refs.script.$refs.selector).dropdown("clear");
			},
			async loadData() {
				try {
					const res = axios.get("http://127.0.0.1:8000/");
					const response = (await res).data;
					this.serverData = response;
					// for (const each of response) {
					// 	this.scriptTitles.push(each.script_name);
					// }
					this.isLoading = false;
				} catch (err) {
					console.log(err.response.data);
					console.log("Nie załadowało się!");
				}
			},
			async reloadData(ans) {
				this.isSaving = true;
				await this.getData(false);
				await this.displayScript(ans.name, ans.bool);
				$(".box-2").toast({
					border: "none",
					displayTime: "auto",
					position: "bottom left",
					class: "success",
					title: "Script completed!",
					message: "Good job!",
				});
				this.isSaving = false;
				// this.mainViewKey +=1;
			},
			async getData(bool) {
				this.isLoading = bool;
				$(this.$refs.navbar.$refs.group.$refs.selector).dropdown("clear");
				$(this.$refs.navbar.$refs.script.$refs.selector).dropdown("clear");
				await this.checkTakenScripts();
				await this.loadData();
				this.countScenarios();
			},
			async displayScript(e, bool = true) {
				// await this.loadData();
				this.isLoadingScript = bool;
				const res = axios.get("http://127.0.0.1:8000/script", {
					params: {
						script_name: e,
					},
				});
				const response = (await res).data;
				for (const scriptObj of response) {
					this.scriptChosen = "A";
					let rawText = JSON.stringify(scriptObj.script).replace(
						/(\\r)*\\n/g,
						"<br>"
					);

					this.scriptText = JSON.parse(rawText);
					this.scriptData = {
						id: scriptObj.id,
						name: scriptObj.script_name,
						script: this.scriptText,
						notes: scriptObj.notes,
						type: scriptObj.caller_type,
						updateTime: scriptObj.update_time,
						userName: scriptObj.user_name,
						isFinished: scriptObj.script_finished,
						finishDate: scriptObj.finish_date,
						finishTime: scriptObj.finish_time,
						firstName: this.loggedUserData.firstName,
						lastName: this.loggedUserData.lastName,
						userId: this.loggedUserData.userId,
					};
				}
				this.isLoadingScript = false;
				// console.log(response);
				// for (const scriptObj of this.serverData) {
				// 	if (scriptObj.script_name == e) {
				// 		let rawText = JSON.stringify(scriptObj.script).replace(
				// 			/(\\r)*\\n/g,
				// 			"<br>"
				// 		);
				// 		this.scriptChosen = "A";
				// 		this.scriptText = JSON.parse(rawText);
				// 		this.scriptData = {
				// 			id: scriptObj.id,
				// 			name: scriptObj.script_name,
				// 			script: this.scriptText,
				// 			notes: scriptObj.notes,
				// 			type: scriptObj.caller_type,
				// 			updateTime: scriptObj.update_time,
				// 			userName: scriptObj.user_name,
				// 			isFinished: scriptObj.script_finished,
				// 			finishDate: scriptObj.finish_date,
				// 			finishTime: scriptObj.finish_time,
				// 			firstName: this.loggedUserData.firstName,
				// 			lastName: this.loggedUserData.lastName,
				// 			userId: this.loggedUserData.userId,
				// 		};
				// 	}
				// }
			},
		},

		components: {
			Navbar,
			myContent: Content,
		},
	};
</script>

<style>
	.containbox {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.box-2 {
		width: 100%;
		/* background: purple; */
		flex: 4;
		border: 1px solid grey;
	}
</style>