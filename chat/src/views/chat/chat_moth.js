export default {

    methods: {
        ialert: function (message) {
            this.tishi = message;
            this.alertShow = true;
        },
        confrimalert: function (modelnext) {
            this.modelnext = modelnext;
            this.modelShow = true;
        },
        idialogClose: function () {
            this.dialogShow = 'none'
        },
        changeFriendTab: function (num) {
            this.$refs.if_friend_opt.style.left = "" + 100 * num + "%";
        },
        changeLeftTab: function (num) {
            this.$refs.lefttab.style.left = "-" + 100 * num + "%";
        },
        loadImage: function () {
            var $this = this;
            this.$nextTick(() => {
                $this.$refs.messlist.scrollTop = $this.$refs.messlist.scrollHeight;
            });
        },

        getFriend: function () {
            var $this = this;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getFriend",
                    {
                        params: {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                        },
                    }
                )
                .then(function (response) {
                    if (response.data.state != "false") {
                        $this.friendList = response.data;
                    } else {
                        $this.friendList = [];
                    }
                })
                .catch(function () {
                    $this.friendList = [];
                });
        },
        getCrowd: function () {
            var $this = this;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getCrowd",
                    {
                        params: {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                        },
                    }
                )
                .then(function (response) {
                    if (response.data.state != "false") {
                        $this.crowdList = response.data;
                    } else {
                        $this.crowdList = [];
                    }
                })
                .catch(function () {
                    $this.friendList = [];
                });
        },
        getSystemAlert: function () {
            var $this = this;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getSystemMessage",
                    {
                        params: {},
                    }
                )
                .then(function (response) {
                    $this.systemAlert = response.data;
                })
                .catch(function () { });
        },
        getFriendInfo: function (chosenFriend) {
            var $this = this;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getFriendInfo",
                    {
                        params: {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                            withWho: chosenFriend
                        },
                    }
                )
                .then(function (response) {
                    $this.friend_info = response.data[0];
                    $this.dialogShow = 'friendinfo'
                })
                .catch(function () {
                    $this.ialert('操作失败')
                });
        },
        getFriendRequest: function () {
            var $this = this;
            $this.ifHaveReq = 0;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getFriendRequest",
                    {
                        params: {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                        },
                    }
                )
                .then(function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        if (
                            response.data[i].from != $this.account &&
                            response.data[i].pendding == "pendding"
                        ) {
                            $this.ifHaveReq++;
                        }
                    }
                    $this.friendReq = response.data;
                })
                .catch(function () { });
        },
        sendImg: function () {
            if (document.getElementById("filetest").files[0]) {
                var $this = this;
                var reader = new FileReader();
                reader.readAsBinaryString(document.getElementById("filetest").files[0]);
                reader.onloadend = function () {
                    if ($this.chosenFriend) {
                        var postdata = {
                            type: "message",
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                            message: {
                                type: "img",
                                img: reader.result,
                            },
                            from: $this.$store.state.account,
                            to: $this.chosenFriend,
                        };
                        $this.axios
                            .post(
                                "http://" +
                                process.env.VUE_APP_API +
                                ":" +
                                process.env.VUE_APP_API_REQ +
                                "/sendImg",
                                postdata
                            )
                            .then(function () { })
                            .catch(function () { });
                    }
                };
            }
        },
        deletefun: function (chosenFriend) {
            var $this = this;
            this.confrimalert(function () {
                var chlist;
                if ($this.chosen_type == 'person') {
                    chlist = '/deleteFriend'
                } else if ($this.chosen_type == 'group') {
                    chlist = '/deleteCrowd'
                }

                this.axios
                    .post(
                        "http://" +
                        process.env.VUE_APP_API +
                        ":" +
                        process.env.VUE_APP_API_REQ +
                        chlist,
                        {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                            withWho: chosenFriend,
                        }
                    )
                    .then(function (e) {
                        if (e.data.state) {
                            $this.chosenFriend = ""
                            $this.changeFriendTab(1)
                            $this.ialert("已经删除");
                            $this.getFriend();
                            $this.getFriendRequest();
                            $this.getCrowd();
                        } else {
                            $this.chosenFriend = ""
                            $this.changeFriendTab(1)
                            $this.ialert("删除失败");
                        }
                    })
                    .catch(function () {
                        $this.ialert("删除失败");
                    });
            })
        },
        getMessageWith: function (chosen) {
            this.chosenFriendInfo=chosen;
            var withWho=chosen.account
            var $this = this;
            var ind = $this.friendList.findIndex(function (e) {
                if (e.account == withWho) return true;
            });
            $this.friendList[ind].unread = 0;

            this.chosenFriend = withWho;
            this.axios
                .get(
                    "http://" +
                    process.env.VUE_APP_API +
                    ":" +
                    process.env.VUE_APP_API_REQ +
                    "/getMessageWith",
                    {
                        params: {
                            token: $this.$store.state.token,
                            account: $this.$store.state.account,
                            withWho: withWho,
                        },
                    }
                )
                .then(function (response) {
                    $this.messageList = response.data;
                })
                .catch(function () { });
        }
    }
}