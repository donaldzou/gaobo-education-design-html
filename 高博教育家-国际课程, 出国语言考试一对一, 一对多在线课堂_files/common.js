/*
浏览器版本
@Browser = 浏览器
@Version = IE版本号
 */
var Browser_Version = window.navigator.userAgent.toLowerCase();
var Browser ;
var Version ;
if( Browser_Version.indexOf('msie') > 0 ){
    Browser  = 'IE';
    if(Browser_Version.indexOf('msie 9.0') > 0 ){
        Version = '9';
    }
    else if(Browser_Version.indexOf('msie 8.0') > 0 ){
        Version = '8';
    }
    else if(Browser_Version.indexOf('msie 7.0') > 0 ){
        Version = '7';
    }
    else if(Browser_Version.indexOf('msie 6.0') > 0 ){
        Version = '6';
    }
}else if( Browser_Version.indexOf('firefox') > 0  ){
    Browser = 'Firefox';
}else if( Browser_Version.indexOf('chrome')  > 0  ){
    Browser = 'Chrome';
}else{
    Browser = 'Other'
}

/*
定义编辑器工具栏
 */
var ue_toolbars = [
    'source', 'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
    'fontfamily', 'fontsize', '|',
    'directionalityltr', 'directionalityrtl', 'indent', '|',
    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
    'simpleupload', 'insertimage', 'attachment', 'map', 'gmap', '|',
    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
    'drafts'
];

/*
加载状态
 */
function iframe_loading(){
    var loading = '<div class="loading"><i class="fa fa-refresh fa-spin"></i></div>';
    $('.content-wrapper').append(loading);
}

/*
父窗口加载状态消除
 */
function iframe_loaded(){
    //父窗口加载状态消除
    $('.loading',window.parent.document).remove();
}

/*
当前窗口添加加载状态
 */
function loading(){
    if(Version == '6' || Version == '7' ){
        var height = $(document).height();
        var width = $(document).width();
        var loading = '<div class="loading" style="line-height:'+height+'px;height:'+height+'px;width:'+width+'px"><i class="fa fa-refresh fa-spin"></i></div>';
    }else{
        var height = $(window).height();
        var width = $(window).width();
        var loading = '<div class="loading" style="position:fixed;top:0;left:0;line-height:'+height+'px;"><i class="fa fa-refresh fa-spin"></i></div>';
    }
    $('body').append(loading);
}

/*
当前窗口清除加载状态
 */
function loaded(){
    $('.loading').remove();
}

/*
模态框调出
 */
function AlertBox(){
    var is_confirm = 0;
    var box = '<div id="myModal" class="modal modal-warning fade"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> <h4 class="modal-title">请注意</h4> </div> <div class="modal-body"> <p>确定要进行该操作吗？</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-outline pull-left" data-dismiss="modal" id="cancel">取消</button> <button type="button" class="btn btn-outline" id="confirm">确定</button> </div> </div> <!-- /.modal-content --> </div> <!-- /.modal-dialog --> </div>'
    $('body').append(box);
    $('#myModal').modal('show')
    $('#confirm').click(function () {
        is_confirm = 1
    })
    return is_confirm ? true : false;
}

/*
AJAX-POST
 */
$(function(){

    $('.ajax-submit').click(function (e){

        e.preventDefault();
        var that = $(this);

        if($(this).hasClass('ajax-del')){
            if( !confirm('请确定是否要执行该操作？') ){
                return false;
            }
        }

        if($(this).hasClass('ajax-post')) {

            var form_id = $(this).attr('data-form');

            var url = $(this).attr('data-href');
            if (typeof(url) == "undefined"){
                url = $('#' + form_id).attr('action');
            }

            var form_data = '';
            var forms = form_id.split(',');
            if ( forms.length > 1) {
                for (var i in forms) {
                    form_data += form_data ? '&' + $('#' + forms[i]).serialize() : $('#' + forms[i]).serialize();
                }
            } else {
                form_data = $('#' + form_id).serialize();
            }

            $.ajax({
                url: url,
                type: 'post',
                data: form_data,
                beforeSend: loading(),
                success: function (data) {
                    if( data!='' && data.status == 1 ){
                        if(that.hasClass('long-tips')){
                            var content = '<div style="padding:10px;">'+data.info+'<p style="text-align:center; padding-top:20px;"><a class="btn btn-success" href="'+data.url+'">确定</a></p></div>'
                            layer.open({
                                type: 1,
                                skin: 'layui-layer-rim', //加上边框
                                area: ['420px', '240px'], //宽高
                                content: content
                            });
                        }else{
                            layer.msg(data.info, {
                                icon: 1,
                                time : 2000
                            }, function(){
                                if(!that.hasClass('ajax-noreload')){
                                    if(data.url){
                                        window.location.href = data.url;
                                    }else {
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    }else if ( data!='' && data.status == 0) {
                        layer.msg(data.info, {icon: 0});
                    }else{
                        if(data){
                            layer.msg(data, {icon: 7});
                        }else{
                            layer.msg('系统出错！请稍后再试', {icon: 7});
                        }
                    }
                    loaded();
                },
                error:function(){
                    loaded();
                    layer.msg('系统异常！请稍后再试', {icon: 7});
                }
            })
        }else{
            var url = $(this).attr('data-href');
            $.ajax({
                url: url,
                beforeSend: loading(),
                success: function (data) {
                    if(data.status == 1 ){
                        layer.msg(data.info, {
                            icon: 1,
                            time : 2000
                        }, function(){
                            if(!that.hasClass('ajax-noreload')){
                                if(data.url){
                                    window.location.href = data.url;
                                }else {
                                    window.location.reload();
                                }
                            }
                        });
                    }else if ( data.status == 0) {
                        layer.msg(data.info, {icon: 0});
                    }else{
                        if(data.info){
                            layer.msg(data.info, {icon: 7});
                        }else{
                            layer.msg('系统出错！请稍后再试', {icon: 7});
                        }
                    }
                    loaded();
                },
                error:function(){
                    loaded();
                    layer.msg('系统异常！请稍后再试', {icon: 7});
                }
            })
        }
    })

})

/**
 * layer新建IFrame
 */
function OpenFrame( url , title, width , height , shadeClose , cancel_reload ){
    if( width == undefined){
        width = '90%';
    }
    if( height == undefined){
        height = '500px';
    }
    if( shadeClose == undefined){
        shadeClose = true;
    }
    if( cancel_reload == undefined){
        cancel_reload = false;
    }
    layer.open({
        type: 2,
        title: title,
        shadeClose: shadeClose,
        shade: 0.1,
        area: [width, height],
        content: url, //iframe的url
        cancel: function(index){
            if(cancel_reload){
                location.reload();
            }
        }
    });
}