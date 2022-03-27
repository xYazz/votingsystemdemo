"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[8],{324:(t,e,n)=>{n.r(e),n.d(e,{default:()=>R});var a=n(0),r=n(1),o=n.n(r),i=n(482),c=n(412),s=n(287),l=n(486),u=n(483),d=n(490),f=n(492),p=n(494),m=n(493),y=n(491),h=n(469),g=n(358),b=n(470),v=n(13),_=n(51),k=n(433),w=n(392),O=n(25);function j(t){return j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},j(t)}function E(t){return function(t){if(Array.isArray(t))return x(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return x(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return x(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function S(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function P(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?S(Object(n),!0).forEach((function(e){V(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):S(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function D(t,e){for(var n=0;n<e.length;n++){var a=e[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function Y(t,e){return Y=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},Y(t,e)}function z(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,a=A(t);if(e){var r=A(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return M(this,n)}}function M(t,e){if(e&&("object"===j(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return C(t)}function C(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function A(t){return A=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},A(t)}function V(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}(0,i.a)((function(){return{cardMedia:{paddingTop:"56.25%"},link:{margin:(0,c.a)().spacing(1,1.5)},cardHeader:{backgroundColor:"light"===(0,c.a)().palette.mode?(0,c.a)().palette.grey[200]:(0,c.a)().palette.grey[700]},voteTitle:{fontSize:"16px",textAlign:"left"},voteText:{display:"flex",justifyContent:"left",alignItems:"baseline",fontSize:"12px",textAlign:"left",marginBottom:(0,c.a)().spacing(2)}}}));const R=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&Y(t,e)}(c,t);var e,n,r,i=z(c);function c(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),V(C(e=i.call(this,t)),"handleChange",(function(t){console.log(t.target.value),e.state.picked_candidates.filter((function(e){return e==t.target.value})).length>0?e.setState(P(P({},e.state),{},{picked_votes:e.state.picked_votes-1,picked_candidates:E(e.state.picked_candidates.filter((function(e){return e!=t.target.value})))})):e.setState(P(P({},e.state),{},{picked_votes:e.state.picked_votes+1,picked_candidates:[].concat(E(e.state.picked_candidates),[t.target.value])}))})),V(C(e),"handleVoteButtonPressed",(function(){e.state.picked_candidates.length<=e.state.max_votes&&e.state.picked_candidates.length>0&&(console.log("test"),e.state.picked_candidates.map((function(t){v.a.post("api/submit_vote/",{vote:e.id,voter:e.state.user,candidate:t}).then((function(t){e.props.history.push("/")}))})))})),e.state={user:localStorage.getItem("access_token")?(0,_.a)(localStorage.getItem("access_token")).user_id:null,type:!1,name:!1,description:!1,start_date:o()().format("DD-MM-YYYY hh:mm:ss"),end_date:o()().format("DD-MM-YYYY hh:mm:ss"),max_votes:e.defaultMaxVotes,vote_voter:[],candidates:[],picked_votes:0,picked_candidates:[],able_to_vote:!0,loading:!0},e.id=e.props.location.state.vote_id,e.getVoteDetails(),e.getVoteVoterDetails(),e}return e=c,(n=[{key:"getVoteDetails",value:function(){var t=this;(0,v.a)("/api/get-vote/"+this.id).then((function(e){console.log(t.id),t.setState({type:e.data.type,name:e.data.name,description:e.data.description,max_votes:e.data.max_votes,start_date:e.data.start_date,end_date:e.data.end_date,candidates:e.data.candidates,loading:!1})}))}},{key:"getVoteVoterDetails",value:function(){var t=this;v.a.get("/api/vote_voter",{params:{vote:this.id,user:this.state.user}}).then((function(e){console.log(e.data),e.data.length>0&&t.setState({able_to_vote:!1})})).catch((function(t){console.log(t)}))}},{key:"render",value:function(){var t=this,e=this.state.picked_votes>this.state.max_votes;return this.props.classes,a.createElement("div",null,a.createElement(k.a,{maxWidth:"md",component:"main",sx:{mb:4}},this.state.loading?a.createElement(O.a,null):a.createElement(w.a,{elevation:16,sx:{my:{xs:3,md:6},p:{xs:2,md:3}}},a.createElement("h3",null,this.name),a.createElement("p",null,"Rodzaj głosowania: ",this.state.type),a.createElement("p",null,"Opis głosowania: ",this.state.description),a.createElement("p",null,"Maksymalna ilość głosów oddanych przez wyborcę: ",this.state.max_votes),a.createElement("p",null,"Data rozpoczęcia: ",o()(this.state.start_date).format("YYYY-MM-DD HH:mm:ss")),a.createElement("p",null,"Data zakończenia: ",o()(this.state.end_date).format("YYYY-MM-DD HH:mm:ss")),this.state.candidates.length<1?a.createElement("h2",null,"Brak kandydatów. Skontaktuj się z twórcą głosowania"):1==this.state.able_to_vote?a.createElement(a.Fragment,null,a.createElement(s.a,{sx:{display:"flex",justifySelf:"center"}},a.createElement(u.a,{required:!0,error:e,component:"fieldset",sx:{m:3},variant:"standard"},a.createElement(l.a,{component:"legend"},"Wybierz kandydatów"),a.createElement(d.a,{"aria-label":"position",row:!0},this.state.candidates.map((function(e){return a.createElement(y.a,{title:a.createElement("h2",null,e.description)},a.createElement(f.a,{control:a.createElement(m.a,{color:"primary",value:e.id,checked:t.state.picked_candidates.filter((function(t){return t==e.id})).length>0,onChange:function(e){return t.handleChange(e)},name:e.first_name+" "+e.last_name}),label:e.first_name+" "+e.last_name}))}))),a.createElement(p.a,null,"Maksymalnie możesz wybrać ",this.state.max_votes," ",1==this.state.max_votes?"kandydata":"kandydatów"))),a.createElement(b.a,{spacing:2,direction:"row",justifyContent:"center",mb:3,mt:3},a.createElement(g.a,{color:"primary",variant:"contained",onClick:this.handleVoteButtonPressed},"Oddaj głos"),a.createElement(g.a,{margin:"15px",color:"secondary",variant:"contained",to:"/votes",component:h.b},"Powrót"))):a.createElement("h2",null,"Nie można oddać więcej głosów. Wyniki zostaną udostępnione po zakończeniu głosowania."))))}}])&&D(e.prototype,n),r&&D(e,r),Object.defineProperty(e,"prototype",{writable:!1}),c}(a.Component)}}]);