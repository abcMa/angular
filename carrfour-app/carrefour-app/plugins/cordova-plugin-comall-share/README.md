## 1.0.2更新说明

- 目前qq分享存在一个appkey的问题，ios和android使用的是不同的appkey所以需要在config.xml中分别配置

```
    <preference name="QQ_APPKEY_IOS" value="1105051458"/>
```

- 引用插件时配置如下：

```
    <plugin name="cordova-plugin-comall-share" spec="../plugins/cordova-plugin-comall-share" >
        <variable name="TENCENT_URL_SCHEME" value="tencent1105051318" />
        <variable name="QQ_URL_SCHEME" value="QQ1105051318" />        
        <variable name="WEIBO_URL_SCHEME" value="wb2498162860" />
        <variable name="QQ_IOS_URLSCHEME_" value="QQ1105051458" />
        <variable name="TENCENT_IOS_URLSCHEME" value="tencent1105051458" />
    </plugin>
```

---

## 使用说明

- 首先，在config.xml 完成以下配置

```
    <preference name="QQ_APPKEY" value="1105051318"/>
    <preference name="SINA_APPKEY" value="2498162860"/>
    <preference name="SINA_REDIRECT_URL" value="http://sns.whalecloud.com/sina2/callback"/>
```

**SINA_REDIRECT_URL** 可以在新浪开发者平台中看到。

<img src="http://gitlab.product.co-mall:10080/frontend/cordova-plugin-comall-share/raw/zyq_dev/src/android/cmshare/sina.png"/>


- 引入插件时，做如下配置

```
  <plugin name="cordova-plugin-comall-share" spec="../plugins/cordova-plugin-comall-share" >
		<variable name="TENCENT_URL_SCHEME" value="tencent1105051318" />
  </plugin>
```

将value值 tencent后面的内容，替换为自己项目中QQ_APPKEY 即可。




