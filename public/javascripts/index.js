;(function () {
  var $list = $('[data-id="list"]');

  $.getJSON('/kfb', {
    p: 1
  }, function (rs) {
    console.log(rs);

    var html = '';

    rs.data.list.forEach(function (item) {
      item.statusTxt = item.status == 1 ? '火爆开服' : '即将开服';

      html += '<li><a href="' + item.gameurl + '" target="_blank"><span>' + item.title + '</span><span>' + item.opentime + '</span><span>' + item.genre + '</span><span>' + item.servername + '</span><span>' + item.operator + '</span><span>' + item.statusTxt + '</span></a></li>';
    });

    $list.html(html);
  });
})();
