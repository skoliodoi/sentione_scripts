<template>
	<div class="homeBackground">
		<div
			class="ui card"
			style="
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-51%, -50%);
			"
		>
			<div class="ui red nag">
				<div class="title">Oops! Something went wrong...</div>
				<div>Try again!</div>
				<i class="close icon"></i>
			</div>
			<div class="image">
				<img src="../assets/oex-vcc-logo.png" alt="" />
			</div>
			<div class="content">
				<form class="ui form" style="">
					<div class="field required" :class="{ error: !loginIsValid }">
						<label>Login:</label>
						<input
							type="text"
							name="login"
							v-model="login"
							placeholder="Login"
						/>
					</div>
					<div class="field required" :class="{ error: !passIsValid }">
						<label>Password:</label>
						<input
							type="password"
							name="password"
							v-model="password"
							placeholder="Hasło"
						/>
					</div>
					<div style="text-align: center">
						<button
							class="ui button"
							type="submit"
							@click.prevent="loginHandler"
							:class="{
								blue: !displayError,
								red: displayError,
								loading: isLoading,
							}"
						>
							{{ errorText }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	import config from "../config";


	export default {
		data() {
			return {
				login: "",
				password: "",
				loginIsValid: true,
				passIsValid: true,
				isLoading: false,
				error: null,
				goToReset: false,
			};
		},
		computed: {
			errorText() {
				if (this.error) {
					return "Try again!";
				} else {
					return "Login";
				}
			},
			displayError() {
				return this.error;
			},
			displayLoading() {
				return this.isLoading;
			},
		},
		methods: {
			async loginHandler() {
				this.isLoading = true;
				if (this.login == "" || this.password == "") {
					this.error = true;
				}
				const res = axios
					.post(`${config.apiBaseUrl}/login`, {
						login: this.login,
						password: this.password,
					})
					.catch((error) => {
						console.log(error.response.data);
						this.wrongData();
						this.error = true;
						this.loginIsValid = false;
						this.passIsValid = false;
						this.isLoading = false;
					});
				const response = (await res).data;
				if (response.status == "success") {
					localStorage.setItem("firstName", response.first_name);
					localStorage.setItem("lastName", response.last_name);
					localStorage.setItem("userId", response.id);
					localStorage.setItem("loggedIn", true);
					localStorage.setItem("initClientCount", response.client_count);
					localStorage.setItem("initAgentCount", response.agent_count);
					localStorage.setItem("token", response.api_key);
					this.$router.replace("/main");
				}
				this.isLoading = false;
			},
			wrongData() {
				$(".ui.nag").nag({ persist: true });
			},
			// async logIn() {
			// 	this.mailIsValid = true;
			// 	this.passIsValid = true;
			// 	this.isLoading = true;
			// 	try {
			// 		await this.$store.dispatch("login", {
			// 			email: this.email,
			// 			password: this.password,
			// 		});
			// 		this.$router.replace("/tracker");
			// 	} catch (err) {
			// 		if (
			// 			(err.message == "INVALID_PASSWORD") |
			// 			(err.message == "MISSING_PASSWORD")
			// 		) {
			// 			this.passIsValid = false;
			// 		} else if (
			// 			err.message == "INVALID_EMAIL" ||
			// 			err.message == "EMAIL_NOT_FOUND"
			// 		) {
			// 			this.mailIsValid = false;
			// 		} else {
			// 			alert(err.message || "Failed to authenticate. Try again later.");
			// 		}
			// 	}
			// 	this.isLoading = false;
			// },
			// async resetPassword() {
			// 	await this.$store.dispatch("resetPassword", this.email);
			// 	alert(
			// 		"An email with the link to reset the password was sent to " +
			// 			this.email +
			// 			". It should arrive in the next couple of minutes. If not - please try again."
			// 	);
			// 	this.passIsValid = true;
			// 	this.goToReset = false;
			// },
		},
	};
</script>

<style scoped>
</style>