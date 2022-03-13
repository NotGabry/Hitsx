<h1 align="center"> <code>Hitsx</code>  </h1>
<p align="center"> <strong> 🎯 Clicks Badge Made Easly </strong> </p>
<p> 
  
  Taking inspiration from [mod.land](https://mod.land) and [js.org](https://js.org).  We provide a free monitoring websites service.  Check Your Website's Clicks With One Easy And Simple API
</p>
<hr>
<h2> 💎 How To Use? </h2>

It's pretty simple.  
Add this to your HTML to display your badge.
NOTE **Also include website Protocol (https, http).**
```html
<img src="https://hitsx.up.railway.app/badge?site=<your website link>">
```

<h2> 💢 How this work? </h2>

It's very easy, every time that the badge is loaded our API add 1 to the total count of hits.  
You can also use your custom fetch system, for example when a user click the button you can make a custom request to our API.  
If you want to use our API make a **POST** request to `https://hitsx.up.railway.app/api/fetch` and add in the body an item named `ID` with your website's URL.  
NOTE **If you use your custom fetch system make sure that when you display your badge add `&devOptions=nofetch` at the end of link's path**

<h2> 💻 Customization </h2>

You can customize background color, second background color, text color and also text content.  
To customize
- Background Color, add `&bgColor=hex color` at the end of link
- Second Background Color, add `&rectColor=hex color` at the end of link
- Text Color, add `&textColor=hex color` at the end of link
- Text Type, add `&textType=<0 or 1>` at the end of link. (0 if you want the "Hits" badge, 1 if you want the "Views" badge)  

NOTE **Omit `#` when adding color HEXs**

<h2> 📅 Info </h2>

Your badge will appear instantly with the current clicks.  
You'll see something like this  
<br>
<img src="https://hitsx.up.railway.app/api/badge?site=https://github.com/Gabry-76/Hitsx?bgColor=000&rectColor=000">


<h2> ✨ Thanks To </h2>

Railway to his beautiful hosting.  
MongoDB to his very useful database system.  
GitHub to his save-life backup file system.  


<img src="https://img.shields.io/badge/HOSTED%20ON%20RAILWAY-000000?style=for-the-badge&logo=Railway&labelColor=000"> <img src="https://img.shields.io/badge/LICENSE-MIT-000?style=for-the-badge&color=000&labelColor=000"> <img src="https://img.shields.io/badge/MongoDB-ALL%20GOOD-000?style=for-the-badge&color=000&labelColor=000">
