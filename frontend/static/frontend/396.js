"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[396],{1396:(e,t,n)=>{n.r(t),n.d(t,{default:()=>O});var r=n(7294),a=n(7513),l=n(5977),i=n(2948),o=n(8996),c=n(1749),u=n(2318),s=n(1120),m=n(3832),d=n(6479),f=n(5407),p=n.n(f);function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){y(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function y(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,l=[],i=!0,o=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(l.push(r.value),!t||l.length!==t);i=!0);}catch(e){o=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(o)throw a}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var E=["Edukacja","Status społeczny","Miejsce zamieszkania"],w=(0,s.Z)((function(e){return{paper:{marginTop:e.spacing(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:e.spacing(1),backgroundColor:e.palette.secondary.main},form:{width:"100%",marginTop:e.spacing(3)},submit:{margin:e.spacing(3,0,2)}}}));const O=function(e){var t=v((0,r.useState)({loading:!0}),2),n=t[0],s=t[1],g=v((0,r.useState)(),2),y=g[0],h=g[1],O=(l.k6,function(e){e.isVisible()?e.hide():e.show()});(0,r.useEffect)((function(){(0,i.Z)("/api/results/"+e.location.state.vote_id).then((function(e){console.log(e.data),s(b(b({},n),{},{results:e.data.results?JSON.parse(e.data.results):e.data.result?JSON.parse(e.data.result):null,detail_id:0,detail_view:!1,loading:!1}))}))}),[]);var j=w();return r.createElement("div",null,r.createElement(m.Z,{component:"main",maxWidth:"xl",sx:{mb:4}},null!=n&&n.loading?r.createElement(a.Z,null):r.createElement(r.Fragment,null,console.log(n.results),r.createElement("form",{className:j.form,noValidate:!0},r.createElement(m.Z,{component:"main",maxWidth:"xs",sx:{mb:2}},n.results?r.createElement(r.Fragment,null,r.createElement(c.Z,{container:!0,spacing:2},r.createElement(c.Z,{item:!0,xs:12,align:"center"},r.createElement(u.Z,{component:"h4",variant:"h4"},"Przegląd wyników")),r.createElement(c.Z,{item:!0,xs:12},r.createElement(o.Z,{variant:"outlined",required:!0,select:!0,fullWidth:!0,label:"Kandydat",name:"candidate",onChange:function(e){e.target.value?(h(n.results.Edukacja[e.target.value]),s(b(b({},n),{},{detail_id:e.target.value,detail_view:!0}))):(h(Object.values(n.results.Kandydaci).map((function(e){return{label:e.label,value:e.value}}))),s(b(b({},n),{},{detail_id:0,detail_view:!1})))}},r.createElement(d.Z,{key:0,value:0},"Ogólny wynik"),n.results.Kandydaci.map((function(e){return r.createElement(d.Z,{key:e.id,value:e.id},e.label)})))),n.detail_view?r.createElement(c.Z,{item:!0,xs:12},r.createElement(o.Z,{variant:"outlined",required:!0,select:!0,fullWidth:!0,label:"Statystyka",name:"choices",onChange:function(e){e.target.value&&h(n.results[e.target.value][n.detail_id])}},E.map((function(e){return r.createElement(d.Z,{key:e,value:e},e)})))):null)):r.createElement(c.Z,{item:!0,xs:12,align:"center"},r.createElement(u.Z,{component:"h4",variant:"h4"},"Nikt nie wziął udziału w wyborach.")))),y?r.createElement(p(),{id:"pie",dataSource:y,palette:"Bright",title:"Podsumowanie",onPointClick:function(e){O(e.target)},onLegendClick:function(e){var t=e.target,n=e.component.getAllSeries()[0].getPointsByArg(t)[0];O(n)}},r.createElement(f.Series,{argumentField:"label",valueField:"value"},r.createElement(f.Label,{visible:!0},r.createElement(f.Connector,{visible:!0,width:1}))),r.createElement(f.Export,{enabled:!0})):null)))}}}]);