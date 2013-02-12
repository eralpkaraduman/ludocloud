# Browser based editorler:
Aktif olarak geliştirilen iki iyi editor var:

* Ace editor
http://ace.ajax.org/
Cloud9 IDE de kullanılan bu. En çok kullanılan editor ama autocomplete için hazır bir çözüm yok, eventleri kullanılabilir. Dokumantasyonu iyi görünüyor.

* CodeMirror
http://codemirror.net/
İkinci seçenek, Kodingen'de kullanılan editor, autocomplete için keyboard shortcutla bir örnek yapmışlar. 

# Veritabanı yapısı
İlk fırsatta farklı userlar/game ler için nasıl bir yapı kurabiliriz ona bakabiliriz birlikte. Birbirini etkilememeli ama  aynı serverda tutmak da isteyebiliriz. Asıl data için MongoDB, skor ve event log (ilerde analytics) gibi şeyler için de Redis düşünüyorum. Bunları ayrı server mi yoksa app serverle birlikte mi açmalıyız o da karar vermemiz gereken bir konu.
