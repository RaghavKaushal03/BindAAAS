<!-- 
	This is the sign in page, it uses the dashboard layout in: 
	"./layouts/Default.vue" .
 -->

<template>
	<div class="sign-in">
		
		<a-row type="flex" :gutter="[24,24]" justify="space-around" align="middle">

			<!-- Sign In Form Column -->
			<a-col :span="24" :md="12" :lg="{span: 12, offset: 0}" :xl="{span: 6, offset: 2}" class="col-form">
				<h1 class="mb-2 font-bold text-5xl">Sign In</h1>
				<h5 class="font-regular text-muted mb-6">Enter your email and password to sign in</h5>

				<!-- Sign In Form -->
				<a-form
					id="components-form-demo-normal-login"
					:form="form"
					class="login-form"
					@submit="handleSubmit"
					:hideRequiredMark="true"
				>
					<a-form-item class="mb-3" label="Email" :colon="false">
						<a-input 
						v-decorator="[
						'email',
						{ rules: [{ required: true, message: 'Please input your email!' }] },
						]" placeholder="Email" />
					</a-form-item>
					<a-form-item class="mb-3" label="Password" :colon="false">
						<a-input
						v-decorator="[
						'password',
						{ rules: [{ required: true, message: 'Please input your password!' }] },
						]" type="password" placeholder="Password" />
					</a-form-item>
					<a-form-item>
						<a-button type="primary" block html-type="submit" class="login-form-button">
							SIGN IN
						</a-button>
					</a-form-item>
				</a-form>
				<!-- / Sign In Form -->

			</a-col>
			<!-- / Sign In Form Column -->

			<!-- Sign In Image Column -->
			<a-col :span="24" :md="12" :lg="12" :xl="12" class="col-img">
				<img src="images/img-signin.jpg" alt="">
			</a-col>
			<!-- Sign In Image Column -->

		</a-row>
		
	</div>
</template>

<script>
// import {getAuth, signInWithEmailAndPassword} from "firebase/auth"

	export default ({
		data() {
			return {
        email: null,
        password: null,
			}
		},
		beforeCreate() {
			// Creates the form and adds to it component's "form" property.
			this.form = this.$form.createForm(this, { name: 'normal_login' });
		},
		methods: {
			// Handles input validation after submission.
			handleSubmit(e) {
				e.preventDefault();
				this.form.validateFields((err, values) => {
					if ( !err ) {
						// console.log('Received values of form: ', values) ;
            this.$http.post("/tokens", {email: values.email, password: values.password}).then(({data}) => {
              localStorage.setItem("token", JSON.stringify(data.token))
              localStorage.setItem("user", JSON.stringify(data.user))
              this.$store.dispatch("SET_RESPONSE", {user: data.user, token: data.token})
              this.$router.push({name: "Dashboard"})
            }).catch(err => {
              console.error(err)
              this.$notification.error({
                message: 'Signin failed',
                description: err.response ? err.response.message : err.message
              });
            })
					}
				});
			},
		},
	})

</script>

<style lang="scss">
	body {
		background-color: #ffffff;
	}
</style>
