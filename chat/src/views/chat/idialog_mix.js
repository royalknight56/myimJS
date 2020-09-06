/*
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-09-05 19:01:15
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 16:39:17
 */
export default {
    methods: {
        logoSet: function () {
            var $this = this;
            let file = document.getElementById("filelogo").files[0];
            let filename = file.name.substr(file.name.lastIndexOf("."));

            if (filename != ".jpg" && filename != ".jpeg" && filename != ".png") {
                $this.dialert("请上传指定图像格式的文件");
                return false;
            }
            if (file.size > 4000000) {
                $this.dialert("图片过大（请低于4M）");
                return false;
            }
            var reader = new FileReader();
            reader.readAsBinaryString(document.getElementById("filelogo").files[0]);
            reader.onloadend = function () {
                var postdata = {
                    type: "setLogo",
                    token: $this.$store.state.token,
                    account: $this.$store.state.account,
                    message: {
                        type: "img",
                        img: reader.result,
                    },
                };
                $this.axios
                    .post(
                        "http://" +
                        process.env.VUE_APP_API +
                        ":" +
                        process.env.VUE_APP_API_REQ +
                        "/setLogo",
                        postdata
                    )
                    .then(function (e) {
                        $this.userlogo = e.data.logo;
                        $this.dialert("上传头像成功");
                        $this.closeDialog()
                    })
                    .catch(function () {
                        $this.dialert("上传头像失败,抱歉");
                        $this.closeDialog()
                    });
            };
        },
        sendLink: function () {
            var reg =/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+).)+([A-Za-z0-9-~\\/])+$/;
            if (reg.test(this.sendLinkInput)) {
                this.$parent.sendLink(this.sendLinkInput);
                this.closeDialog()
            } else {
                this.dialert("请输入正确的链接");
                this.closeDialog()
            }

        },
        logoReady: function () {
            if (this.$refs.file_logo.files[0]) {
                var $this = this;
                $this.chosenFileName = $this.$refs.file_logo.files[0].name;
            }
        },
        addFriend: function () {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/addFriend",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        withWho: $this.addFriendAccount,
                    }
                )
                .then(function (e) {
                    if (e.data.state) {
                        $this.dialert("已经发送好友请求");
                        $this.closeDialog()

                    } else {
                        $this.dialert("添加失败（没有此人或已经是好友）");
                        $this.closeDialog()
                    }
                })
                .catch(function () { });
        },
        addCrowd: function () {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/addCrowd",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        withWho: $this.addCrowdAccount,
                    }
                )
                .then(function (e) {
                    if (e.data.state) {
                        $this.dialert("已经加入");
                        $this.closeDialog()

                    } else {
                        $this.dialert("添加失败");
                        $this.closeDialog()
                    }
                })
                .catch(function () { });
        },
        createCrowd: function () {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/createCrowd",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        crowdAccount: $this.createCrowdAccount,
                        crowdName: $this.createCrowdName,
                    }
                )
                .then(function (e) {
                    if (e.data.state) {
                        $this.dialert("已经创建");
                        $this.closeDialog()

                    } else {
                        $this.dialert("创建失败");
                        $this.closeDialog()
                    }
                })
                .catch(function () { });
        },
        closeDialog: function () {
            this.$nextTick(
                function () {
                    this.$emit("close");
                }
            )
        },
        dialert: function (message) {
            this.$emit("ialerte", message)
        },
        confirmFriend: function (from, to) {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/confirmFriend",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        from,
                        to,
                    }
                )
                .then(function (response) {
                    $this.$parent.friendReq = response.data;
                    $this.$parent.getFriendRequest();
                })
                .catch(function () {
                    $this.dialert("操作失败,请稍后");
                    $this.closeDialog()
                });
        },
        acceptFriend: function (from) {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/acceptFriend",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        from: from,
                        to: $this.$store.state.account,
                    }
                )
                .then(function () {
                    $this.$parent.getFriendRequest();
                })
                .catch(function () {
                    $this.dialert("操作失败,请稍后");
                    $this.closeDialog()
                });
        },
        rejectFriend: function (from) {
            var $this = this;
            this.axios
                .post(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/rejectFriend",
                    {
                        token: $this.$store.state.token,
                        account: $this.$store.state.account,
                        from: from,
                        to: $this.$store.state.account,
                    }
                )
                .then(function () {
                    $this.$parent.getFriendRequest();
                })
                .catch(function () {
                    $this.dialert("操作失败,请稍后");
                    $this.closeDialog()
                });
        },
    },
}