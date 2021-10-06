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
			<div class="ui red nag" id="fixednag">
				<div class="title">Ups! Coś poszło nie tak...</div>
				<div>Chyba dane logowania się nie zgadzają!</div>
				<i class="close icon"></i>
			</div>
			<div class="image">
				<img src="../assets/oex-vcc-logo.png" alt="" />
			</div>
			<div class="content">
				<div class="ui error message centered">
					<div class="header">How did you get here?!</div>
					<p>This page doesn't exist ¯\_(ツ)_/¯</p>
				</div>
				<div style="text-align: center">
					<router-link to="/main" tag="button" class="ui red button"
						>Go back</router-link
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from "axios";

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
					return "Spróbuj ponownie!";
				} else {
					return "Zaloguj się";
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
				const res = axios.get("http://127.0.0.1:8000/users");
				const response = (await res).data;
				// console.log(response);
				for (const loginData of response) {
					// console.log(this.login);
					// console.log(loginData.login);
					if (
						this.login == loginData.login &&
						this.password == loginData.password
					) {
						localStorage.setItem("firstName", loginData.first_name);
						localStorage.setItem("lastName", loginData.last_name);
						localStorage.setItem("userId", loginData.id);
						localStorage.setItem("loggedIn", true);
						localStorage.setItem("initClientCount", loginData.client_count);
						localStorage.setItem("initAgentCount", loginData.agent_count);
						this.$router.replace("/main");
					} else {
						console.log("Złe hasło!");
						this.wrongData();
						this.error = true;
						this.loginIsValid = false;
						this.passIsValid = false;
					}
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