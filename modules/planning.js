/* casô · Planning : moteur de langage local, écran « Mon planning », rappels, agenda, équipe
   (sorti de index.html ; chargé dans l'ordre par le démarrage, voir modules/LISEZ-MOI.md) */
/* ---------- Mon planning : petit moteur de langage local (sans IA payante) ----------
   Le chat comprend les dates et les horaires, dans les 10 langues de l'appli :
   - « mes créneaux de travail sont de 15h à 19h du lundi au vendredi » → créneaux de travail,
     tout le reste s'affiche « Indisponible » ;
   - « mise de carrelage demain à 7h chez Osvald » → rendez-vous, client créé s'il est nouveau ;
   - « je ne suis pas dispo vendredi », « qu'est-ce que j'ai demain ? », « annule le rdv chez Osvald »,
     « déplace le rdv chez Osvald à jeudi 9h ».
   Étapes : normalisation de la langue vers le français → repérage des dates, heures, jours, noms
   → choix de l'intention → action sur le planning (comme les outils list/create/update/delete d'un agent). */
if(!db.events)db.events=[];if(!db.cvTpl)db.cvTpl=[];
const AG_FOLD={'à':'a','â':'a','ä':'a','á':'a','ã':'a','å':'a','ç':'c','é':'e','è':'e','ê':'e','ë':'e','î':'i','ï':'i','í':'i','ì':'i','ô':'o','ö':'o','ó':'o','ò':'o','õ':'o','ù':'u','û':'u','ü':'u','ú':'u','ÿ':'y','ñ':'n','œ':'o','æ':'a','’':"'",'ʼ':"'",'ş':'s','ı':'i','ğ':'g','ă':'a','ș':'s','ț':'t','ą':'a','ę':'e','ł':'l','ń':'n','ś':'s','ź':'z','ż':'z','ć':'c'};
const agFold=s=>{let o='';for(const ch of String(s).toLowerCase()){const x=AG_FOLD[ch];o+=x!=null?x:ch}return o};
const AG_DAYS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const AG_MONTHS=['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];
const agP2=n=>String(n).padStart(2,'0');
const agYmd=d=>d.getFullYear()+'-'+agP2(d.getMonth()+1)+'-'+agP2(d.getDate());
const agDate=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const agAdd=(s,n)=>{const d=agDate(s);d.setDate(d.getDate()+n);return agYmd(d)};
const agMin=t=>{if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m};
const agHm=m=>agP2(Math.floor(m/60)%24)+':'+agP2(m%60);
const agToday=()=>agYmd(new Date());
const agH=t=>t?(+t.slice(0,2))+'h'+(t.slice(3)==='00'?'':t.slice(3)):'';

/* ---- 1. normalisation multilingue vers le français ---- */
const W1='(?<![\\p{L}])',W2='(?![\\p{L}])';
const agRx=(p)=>new RegExp(W1+'(?:'+p+')'+W2,/\\p\{Lu\}/.test(p)?'gu':'giu');
const AG_LEX={
 en:[['day after tomorrow','apres-demain'],['tomorrow','demain'],['today|tonight','aujourd\'hui'],['monday','lundi'],['tuesday','mardi'],['wednesday','mercredi'],['thursday','jeudi'],['friday','vendredi'],['saturday','samedi'],['sunday','dimanche'],
  ['next week','semaine prochaine'],['next','prochain'],['working hours|work hours|business hours|my shifts?|my hours','creneaux de travail'],['i work|i\'m working|i am working','je travaille'],['day off|days off|holidays?|vacation|unavailable|not available|off','indisponible'],
  ['cancel|delete|remove','annule'],['move|reschedule|postpone|push','deplace'],['what do i have|what\'s on|my schedule|my agenda|my planning|my calendar','mon planning'],['in the morning|morning','matin'],['in the afternoon|afternoon','apres-midi'],['in the evening|evening|tonight','soir'],['noon|midday','midi'],['midnight','minuit'],
  ['every','chaque'],['weekdays','en semaine'],['weekend','week-end'],['every day|daily','tous les jours'],['all day|whole day','toute la journee'],['at ([\\p{L}]+)\'s(?: place| house| home)?','chez $1'],['between','entre'],['from','de'],['until|till|to','a'],['and','et'],['at','a'],['for','pendant'],['hours?','h'],['in (\\d+) days?','dans $1 jours'],['appointment|meeting','rdv'],
  ['january','janvier'],['february','fevrier'],['march','mars'],['april','avril'],['may','mai'],['june','juin'],['july','juillet'],['august','aout'],['september','septembre'],['october','octobre'],['november','novembre'],['december','decembre']],
 es:[['pasado mañana','apres-demain'],['por la mañana|de la mañana','matin'],['mañana','demain'],['hoy|esta noche','aujourd\'hui'],['lunes','lundi'],['martes','mardi'],['miércoles|miercoles','mercredi'],['jueves','jeudi'],['viernes','vendredi'],['sábado|sabado','samedi'],['domingo','dimanche'],
  ['la semana que viene|la próxima semana','semaine prochaine'],['próximo|proximo|que viene','prochain'],['mis? horarios? de trabajo|mis turnos','creneaux de travail'],['trabajo|curro','je travaille'],['no estoy disponible|no disponible|día libre|dia libre|vacaciones|libre','indisponible'],
  ['cancela|anula|borra|elimina','annule'],['mueve|cambia|aplaza|pospón|pospon','deplace'],['qué tengo|que tengo|mi agenda|mi planning|mi calendario','mon planning'],['por la tarde|de la tarde|tarde','apres-midi'],['por la noche|noche','soir'],['mediodía|mediodia','midi'],['medianoche','minuit'],
  ['cada|todos los|todas las','chaque'],['entre semana','en semaine'],['fin de semana','week-end'],['todos los días|todos los dias','tous les jours'],['todo el día|todo el dia','toute la journee'],['en casa de|donde','chez'],['a las','a'],['desde las|desde','de'],['hasta las|hasta','a'],['y','et'],['durante','pendant'],['horas?','h'],['dentro de (\\d+) días|en (\\d+) días','dans $1$2 jours'],['cita','rdv'],
  ['enero','janvier'],['febrero','fevrier'],['marzo','mars'],['abril','avril'],['mayo','mai'],['junio','juin'],['julio','juillet'],['agosto','aout'],['septiembre','septembre'],['octubre','octobre'],['noviembre','novembre'],['diciembre','decembre']],
 pt:[['depois de amanhã|depois de amanha','apres-demain'],['de manhã|de manha|pela manhã','matin'],['amanhã|amanha','demain'],['hoje|esta noite','aujourd\'hui'],['segunda(?:-feira)?','lundi'],['terça(?:-feira)?|terca(?:-feira)?','mardi'],['quarta(?:-feira)?','mercredi'],['quinta(?:-feira)?','jeudi'],['sexta(?:-feira)?','vendredi'],['sábado|sabado','samedi'],['domingo','dimanche'],
  ['a próxima semana|a semana que vem','semaine prochaine'],['próxima|proxima|próximo|proximo|que vem','prochain'],['meu horário de trabalho|meus horários de trabalho|meus turnos','creneaux de travail'],['trabalho','je travaille'],['não estou disponível|nao estou disponivel|indisponível|folga|férias|ferias','indisponible'],
  ['cancela|anula|apaga|elimina','annule'],['muda|adia|passa','deplace'],['o que tenho|a minha agenda|minha agenda|o meu planeamento','mon planning'],['à tarde|a tarde|de tarde','apres-midi'],['à noite|a noite|de noite','soir'],['meio-dia','midi'],['meia-noite','minuit'],
  ['cada|todas as|todos os','chaque'],['dias úteis|dias uteis','en semaine'],['fim de semana','week-end'],['todos os dias','tous les jours'],['o dia todo|todo o dia','toute la journee'],['em casa d[oae]|na casa d[oae]','chez'],['às|as','a'],['das|desde','de'],['até|ate','a'],['e','et'],['durante','pendant'],['horas?','h'],['daqui a (\\d+) dias','dans $1 jours'],['marcação|consulta','rdv'],
  ['janeiro','janvier'],['fevereiro','fevrier'],['março|marco','mars'],['abril','avril'],['maio','mai'],['junho','juin'],['julho','juillet'],['agosto','aout'],['setembro','septembre'],['outubro','octobre'],['novembro','novembre'],['dezembro','decembre']],
 it:[['dopodomani','apres-demain'],['domani','demain'],['oggi|stasera','aujourd\'hui'],['lunedì|lunedi','lundi'],['martedì|martedi','mardi'],['mercoledì|mercoledi','mercredi'],['giovedì|giovedi','jeudi'],['venerdì|venerdi','vendredi'],['sabato','samedi'],['domenica','dimanche'],
  ['la prossima settimana|settimana prossima','semaine prochaine'],['prossimo|prossima','prochain'],['(?:i )?miei orari di lavoro|orari di lavoro|i miei turni','creneaux de travail'],['lavoro','je travaille'],['non sono disponibile|non disponibile|ferie|giorno libero|libero','indisponible'],
  ['annulla|cancella|elimina','annule'],['sposta|rimanda','deplace'],['cosa ho|che cosa ho|la mia agenda|il mio planning|il mio calendario','mon planning'],['di mattina|la mattina|mattina','matin'],['di pomeriggio|il pomeriggio|pomeriggio','apres-midi'],['di sera|la sera|sera','soir'],['mezzogiorno','midi'],['mezzanotte','minuit'],
  ['ogni|tutti i|tutte le','chaque'],['nei giorni feriali|giorni feriali','en semaine'],['fine settimana|weekend','week-end'],['tutti i giorni','tous les jours'],['tutto il giorno','toute la journee'],['a casa di|presso','chez'],['dalle','de'],['alle','a'],['fino alle','a'],['e','et'],['per','pendant'],['ore','h'],['tra (\\d+) giorni','dans $1 jours'],['appuntamento','rdv'],
  ['gennaio','janvier'],['febbraio','fevrier'],['marzo','mars'],['aprile','avril'],['maggio','mai'],['giugno','juin'],['luglio','juillet'],['agosto','aout'],['settembre','septembre'],['ottobre','octobre'],['novembre','novembre'],['dicembre','decembre']],
 ro:[['poimâine|poimaine','apres-demain'],['mâine|maine','demain'],['astăzi|astazi|azi|diseară|diseara','aujourd\'hui'],['luni','lundi'],['marți|marti','mardi'],['miercuri','mercredi'],['joi','jeudi'],['vineri','vendredi'],['sâmbătă|sambata','samedi'],['duminică|duminica','dimanche'],
  ['săptămâna viitoare|saptamana viitoare','semaine prochaine'],['viitoare|viitor','prochain'],['programul (?:meu )?de lucru|orele (?:mele )?de lucru','creneaux de travail'],['lucrez','je travaille'],['nu sunt disponibil|indisponibil|liber|concediu','indisponible'],
  ['anulează|anuleaza|șterge|sterge','annule'],['mută|muta|amână|amana','deplace'],['ce am|agenda mea|programul meu','mon planning'],['dimineața|dimineata','matin'],['după-amiaza|dupa-amiaza|după amiază','apres-midi'],['seara','soir'],['prânz|pranz','midi'],['miezul nopții','minuit'],
  ['în fiecare|in fiecare|fiecare','chaque'],['în timpul săptămânii|in timpul saptamanii','en semaine'],['weekend','week-end'],['în fiecare zi|in fiecare zi|zilnic','tous les jours'],['toată ziua|toata ziua','toute la journee'],['la ora','a'],['de la','de'],['până la|pana la','a'],['și|si','et'],['timp de','pendant'],['ore','h'],['peste (\\d+) zile','dans $1 jours'],['programare|întâlnire','rdv'],['la(?= \\p{Lu})','chez'],
  ['ianuarie','janvier'],['februarie','fevrier'],['martie','mars'],['aprilie','avril'],['mai','mai'],['iunie','juin'],['iulie','juillet'],['august','aout'],['septembrie','septembre'],['octombrie','octobre'],['noiembrie','novembre'],['decembrie','decembre']],
 tr:[['pazartesiden','du lundi'],['salıdan|salidan','du mardi'],['cumaya','au vendredi'],['cumartesiye','au samedi'],['pazara','au dimanche'],['öbür gün|obur gun|yarından sonra','apres-demain'],['yarın|yarin','demain'],['bugün|bugun|bu akşam','aujourd\'hui'],['pazartesi(?:den|ye|ya)?','lundi'],['salı|sali','mardi'],['çarşamba|carsamba','mercredi'],['perşembe|persembe','jeudi'],['cuma(?:ya|dan)?','vendredi'],['cumartesi','samedi'],['pazar','dimanche'],
  ['gelecek hafta|haftaya','semaine prochaine'],['gelecek|önümüzdeki','prochain'],['çalışma saatlerim|calisma saatlerim|mesai saatlerim','creneaux de travail'],['çalışıyorum|calisiyorum','je travaille'],['müsait değilim|musait degilim|izinliyim|izin|tatil','indisponible'],
  ['iptal et|iptal|sil','annule'],['ertele|taşı|tasi','deplace'],['neyim var|ajandam|programım|programim','mon planning'],['sabah','matin'],['öğleden sonra|ogleden sonra','apres-midi'],['akşam|aksam','soir'],['öğlen|oglen','midi'],['gece yarısı','minuit'],
  ['hafta içi|hafta ici','en semaine'],['her','chaque'],['hafta sonu','week-end'],['her gün|her gun','tous les jours'],['bütün gün|butun gun|tüm gün','toute la journee'],['saat','a'],['ve','et'],['saatlik|saat boyunca','h'],['(\\d+) gün sonra','dans $1 jours'],['randevu','rdv'],
  ['ocak','janvier'],['şubat|subat','fevrier'],['mart','mars'],['nisan','avril'],['mayıs|mayis','mai'],['haziran','juin'],['temmuz','juillet'],['ağustos|agustos','aout'],['eylül|eylul','septembre'],['ekim','octobre'],['kasım|kasim','novembre'],['aralık|aralik','decembre']],
 pl:[['pojutrze','apres-demain'],['jutro','demain'],['dzisiaj|dziś|dzis|dziś wieczorem','aujourd\'hui'],['poniedziałek|poniedzialek|poniedziałku|poniedzialku','lundi'],['wtorek|wtorku','mardi'],['środa|środę|środy|sroda|srode','mercredi'],['czwartek|czwartku','jeudi'],['piątek|piatek|piątku|piatku','vendredi'],['sobota|sobotę|soboty|sobote','samedi'],['niedziela|niedzielę|niedzieli|niedziele','dimanche'],
  ['w przyszłym tygodniu|w przyszlym tygodniu','semaine prochaine'],['przyszły|przyszly|przyszłą|następny|nastepny','prochain'],['moje godziny pracy|godziny pracy','creneaux de travail'],['pracuję|pracuje','je travaille'],['nie jestem dostępny|niedostępny|niedostepny|wolne|urlop','indisponible'],
  ['odwołaj|odwolaj|usuń|usun','annule'],['przesuń|przesun|przełóż|przeloz','deplace'],['co mam|mój plan|moj plan|mój kalendarz|moj kalendarz','mon planning'],['rano','matin'],['po południu|po poludniu','apres-midi'],['wieczorem','soir'],['w południe|w poludnie','midi'],['o północy','minuit'],
  ['w dni robocze|w tygodniu','en semaine'],['w każdy|w każdą|każdy|każdą|co','chaque'],['w weekend|weekend','week-end'],['codziennie|każdego dnia','tous les jours'],['cały dzień|caly dzien','toute la journee'],['u','chez'],['od','de'],['do','a'],['o','a'],['i','et'],['przez','pendant'],['godzin[ay]?','h'],['za (\\d+) dni','dans $1 jours'],['wizyta|spotkanie','rdv'],
  ['stycznia|styczeń|styczen','janvier'],['lutego|luty','fevrier'],['marca|marzec','mars'],['kwietnia|kwiecień','avril'],['maja|maj','mai'],['czerwca|czerwiec','juin'],['lipca|lipiec','juillet'],['sierpnia|sierpień','aout'],['września|wrzesnia|wrzesień','septembre'],['października|pazdziernika|październik','octobre'],['listopada|listopad','novembre'],['grudnia|grudzień|grudzien','decembre']],
 ru:[['послезавтра','apres-demain'],['завтра','demain'],['сегодня|сегодня вечером','aujourd\'hui'],['понедельник[а]?','lundi'],['вторник[а]?','mardi'],['сред[ауы]','mercredi'],['четверг[а]?','jeudi'],['пятниц[ауы]','vendredi'],['суббот[ауы]','samedi'],['воскресень[ея]','dimanche'],
  ['на следующей неделе','semaine prochaine'],['следующ(?:ий|ую|ее|ей)','prochain'],['мои рабочие часы|рабочие часы|мой рабочий график|мой график','creneaux de travail'],['работаю','je travaille'],['не могу|не доступен|недоступен|выходной|отпуск','indisponible'],
  ['отмени|удали','annule'],['перенеси|передвинь','deplace'],['что у меня|мой план|моё расписание|мое расписание|мой календарь','mon planning'],['утром','matin'],['днём|днем|после обеда','apres-midi'],['вечером','soir'],['в полдень','midi'],['в полночь','minuit'],
  ['по будням|в будни','en semaine'],['каждый|каждую|каждое','chaque'],['в выходные|выходные','week-end'],['каждый день|ежедневно','tous les jours'],['весь день','toute la journee'],['у','chez'],['с','de'],['до','a'],['по','au'],['в','a'],['и','et'],['часа|часов|час','h'],['через (\\d+) дн(?:я|ей)','dans $1 jours'],['встреча|запись','rdv'],
  ['января','janvier'],['февраля','fevrier'],['марта','mars'],['апреля','avril'],['мая','mai'],['июня','juin'],['июля','juillet'],['августа','aout'],['сентября','septembre'],['октября','octobre'],['ноября','novembre'],['декабря','decembre']],
 ar:[['بعد غد','apres-demain'],['غدا|غداً|بكرة','demain'],['اليوم|الليلة','aujourd\'hui'],['الاثنين|الإثنين','lundi'],['الثلاثاء','mardi'],['الأربعاء|الاربعاء','mercredi'],['الخميس','jeudi'],['الجمعة','vendredi'],['السبت','samedi'],['الأحد|الاحد','dimanche'],
  ['الأسبوع القادم|الاسبوع القادم','semaine prochaine'],['القادم|المقبل','prochain'],['ساعات عملي|أوقات عملي|اوقات عملي|ساعات العمل','creneaux de travail'],['أعمل|اعمل|أشتغل','je travaille'],['لست متاحا|غير متاح|عطلة|إجازة|اجازة','indisponible'],
  ['ألغ|الغ|ألغي|احذف','annule'],['أجل|انقل','deplace'],['ماذا لدي|جدولي|برنامجي|مواعيدي','mon planning'],['صباحا|صباحاً|الصباح','matin'],['بعد الظهر|بعد الظهيرة','apres-midi'],['مساء|مساءً|المساء','soir'],['الظهر','midi'],['منتصف الليل','minuit'],
  ['أيام الأسبوع|ايام الاسبوع','en semaine'],['كل','chaque'],['عطلة نهاية الأسبوع|نهاية الأسبوع','week-end'],['كل يوم|يوميا','tous les jours'],['طوال اليوم|كل اليوم','toute la journee'],['عند|لدى','chez'],['الساعة','a'],['من','de'],['إلى|الى|حتى','a'],['و','et'],['لمدة','pendant'],['ساعات|ساعة','h'],['بعد (\\d+) أيام','dans $1 jours'],['موعد','rdv'],
  ['يناير|كانون الثاني','janvier'],['فبراير|شباط','fevrier'],['مارس|آذار','mars'],['أبريل|ابريل|نيسان','avril'],['مايو|أيار','mai'],['يونيو|حزيران','juin'],['يوليو|تموز','juillet'],['أغسطس|اغسطس|آب','aout'],['سبتمبر|أيلول','septembre'],['أكتوبر|اكتوبر|تشرين الأول','octobre'],['نوفمبر|تشرين الثاني','novembre'],['ديسمبر|كانون الأول','decembre']]};
const AG_LEXC={};
/* réserver le prochain créneau libre, dans chaque langue (appliqué avant le reste du lexique) */
[['en',[['(?:the )?(?:next|first|earliest)(?: available| free| open)? (?:slot|time slot|opening|gap)','le prochain creneau'],['book me|book|reserve|block out|block|grab','reserve'],['at(?= \\p{Lu}\\p{L}+(?![\\p{L}\\u0027]))','chez'],['for an?|for the','pour']]],
 ['pt',[['(?:o )?(?:próximo|proximo|primeiro) (?:horário|horario|espaço|espaco|vaga|tempo)(?: livre| disponível| disponivel)?','le prochain creneau'],['reserva-me|reserva|reserve|marca|bloqueia','reserve'],['para um|para uma|para o|para a','pour']]],
 ['es',[['(?:el )?(?:próximo|proximo|primer) (?:hueco|horario|turno|espacio)(?: libre| disponible)?','le prochain creneau'],['resérvame|reservame|reserva|bloquea|apunta','reserve'],['para un|para una|para el|para la','pour']]],
 ['it',[['(?:il )?(?:prossimo|primo) (?:slot|orario|spazio|buco|momento)(?: libero| disponibile)?','le prochain creneau'],['prenotami|prenota|blocca|fissa','reserve'],['per un|per una|per il|per la','pour'],['da(?= \\p{Lu})','chez']]],
 ['ro',[['(?:următorul|urmatorul|primul) (?:interval|loc|moment)(?: liber| disponibil)?','le prochain creneau'],['rezervă-mi|rezerva-mi|rezervă|rezerva|blochează|blocheaza|programează|programeaza','reserve'],['pentru o|pentru un','pour']]],
 ['tr',[['(?:bir )?sonraki (?:boş |bos |müsait |musait )?(?:saati|saat|zamanı|zamani|aralığı|araligi)|ilk (?:boş|bos|müsait|musait) (?:saati|saat|zamanı|zamani)','le prochain creneau'],['rezerve et|ayır|ayir|ayarla','reserve'],['(\\p{Lu}\\p{L}+) için','pour $1'],['için','pour']]],
 ['pl',[['(?:najbliższy|najblizszy|następny|nastepny|pierwszy) (?:wolny )?(?:termin|slot|czas)(?: wolny)?','le prochain creneau'],['zarezerwuj mi|zarezerwuj|zablokuj|zaplanuj','reserve'],['na(?= \\p{Ll})','pour']]],
 ['ru',[['(?:ближайшее|следующее|первое) (?:свободное )?(?:окно|время)|(?:ближайший|следующий|первый) (?:свободный )?слот','le prochain creneau'],['забронируй|зарезервируй|запиши|поставь','reserve'],['для','pour']]],
 ['ar',[['الموعد القادم|أقرب موعد|اقرب موعد|أول موعد متاح|اول موعد متاح|الموعد المتاح القادم','le prochain creneau'],['احجز لي|احجزلي|احجز|إحجز','reserve']]]
].forEach(([l,E])=>{if(AG_LEX[l])AG_LEX[l].unshift(...E)});
function agNorm(t,lang){
 let s=String(t).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[’ʼ]/g,"'").replace(/،/g,',').replace(/؟/g,'?');
 // heures anglaises 7pm / 7:30 am
 s=s.replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)(?![\p{L}])/giu,(m,h,mi,ap)=>{let H=+h%12;if(/p/i.test(ap))H+=12;return H+'h'+(mi||'')});
 // turc : 15'ten 19'a, Osvald'da
 if(lang==='tr'){s=s.replace(/(\d{1,2})'(?:de|da|te|ta)(?![\p{L}])/gu,'$1h').replace(/(\d{1,2})(?::(\d{2}))?'?(?:den|dan|ten|tan)\s+(\d{1,2})(?::(\d{2}))?'?(?:e|a|ye|ya)(?![\p{L}])/giu,'de $1h$2 a $3h$4').replace(/(\p{Lu}\p{L}+)'(?:de|da|te|ta|in evinde|ın evinde|un evinde)(?![\p{L}])/gu,'chez $1')}
 const L=AG_LEX[lang];
 if(L){if(!AG_LEXC[lang])AG_LEXC[lang]=L.map(([a,b])=>[agRx(lang==='ar'?fzArRx(a):a),b]);AG_LEXC[lang].forEach(([r,b])=>{s=s.replace(r,(...m)=>' '+b.replace(/\$(\d)/g,(x,i)=>m[+i]||'')+' ')})}
 // anglais « next monday » → « lundi prochain »
 s=s.replace(/prochain\s+(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/gi,'$1 prochain');
 return s.replace(/\s{2,}/g,' ').trim()}

/* ---- 2. repérage des dates, heures, jours ---- */
function agBlank(o,i,n){o.W=o.W.slice(0,i)+' '.repeat(n)+o.W.slice(i+n)}
function agEach(o,re,fn){re.lastIndex=0;let m;const out=[];while((m=re.exec(o.W))){out.push(m);if(!re.global)break}
 out.forEach(m=>{o._i=m.index;if(fn(m)!==false)agBlank(o,m.index,m[0].length)})}
function agPD(o,d){o.dates.push(d);(o.dp||(o.dp=[])).push(o._i||0)}
const AG_DRX='lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche',AG_MRX=AG_MONTHS.join('|');
function agMk(d,mo,y){const now=new Date();let Y=y?+y:now.getFullYear();if(Y<100)Y+=2000;let M=mo==null?now.getMonth():mo;if(M<0||M>11||d<1||d>31)return null;
 const td=agToday();
 if(mo==null){for(let k=0;k<13;k++){const D=new Date(Y,M+k,d);if(D.getDate()!==d)continue;if(y||agYmd(D)>=td)return agYmd(D)}return null}
 let D=new Date(Y,M,d);if(D.getMonth()!==M)return null;
 if(!y&&agYmd(D)<td){D=new Date(Y+1,M,d);if(D.getMonth()!==M)return null}
 return agYmd(D)}

/* ---- 3. intention ---- */
const AG_STOP=new Set(['demain','aujourd','a','au','le','la','les','l','de','du','des','d','pour','et','ou','avec','chez','vers','dans','sur','ce','cette','mon','ma','mes','un','une','h','rdv','matin','soir','midi','prochain','semaine','client','monsieur','madame','m','mme','mr','apres','avant','lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche','ici','la-bas','faire','pose','mise']);
/* ---- 4. le planning ---- */
function agDispo(){return db.events.find(e=>e.id==='dispo')||null}
const agHours=()=>{const d=agDispo();return d&&(d.w||[]).length?d:null};
function agFreeRanges(d){ // créneaux de travail du jour (minutes), moins les absences
 const dp=agHours(),wd=agDate(d).getDay();let R=dp?[]:[[0,1440]];
 if(dp)(dp.w||[]).forEach(w=>{if(w.d.includes(wd))w.r.forEach(r=>R.push([agMin(r[0]),agMin(r[1])]))});
 db.events.filter(e=>e.t==='off'&&agOccurs(e,d)).forEach(e=>{const a=e.a?agMin(e.a):0,b=e.b?agMin(e.b):1440;R=R.flatMap(([x,y])=>{const o=[];if(a>x)o.push([x,Math.min(y,a)]);if(b<y)o.push([Math.max(x,b),y]);return o.filter(([p,q])=>q>p)})});
 return R.sort((a,b)=>a[0]-b[0])}
function agCheck(ev,day){ // hors créneaux ? chevauchements ?
 const out={hors:false,over:[]};if(ev.t!=='rdv')return out;const D=day||(ev.rr?agNextOcc(ev,ev.d):ev.d)||ev.d;
 const F=agFreeRanges(D);
 if(ev.a){const a=agMin(ev.a),b=ev.b?agMin(ev.b):a+60;out.hors=!F.some(([x,y])=>a>=x&&b<=y)}else out.hors=!F.length;
 if(ev.a)out.over=db.events.filter(e=>e!==ev&&e.id!==ev.id&&e.t==='rdv'&&agOccurs(e,D)&&e.a&&agMin(e.a)<(ev.b?agMin(ev.b):agMin(ev.a)+60)&&(e.b?agMin(e.b):agMin(e.a)+60)>agMin(ev.a));
 return out}
function agFmtD(d,o){try{return agDate(d).toLocaleDateString(I18N.lang==='fr'?'fr-FR':I18N.lang,Object.assign({weekday:'long',day:'numeric',month:'long'},o||{}))}catch(e){return d}}
function agFmtR(ev){return ev.a?agH(ev.a)+(ev.b?' – '+agH(ev.b):''):i18nT('Toute la journée')}
function agDispoTxt(dp){if(!dp||!dp.w||!dp.w.length)return'';
 const sh=k=>{try{return new Date(2026,10,1+((k+7)%7)).toLocaleDateString(I18N.lang==='fr'?'fr-FR':I18N.lang,{weekday:'short'})}catch(e){return AG_DAYS[k].slice(0,3)}};
 return dp.w.map(w=>{const d=w.d.slice().sort((a,b)=>((a+6)%7)-((b+6)%7));const run=d.length>2&&d.every((x,i)=>i===0||((x+6)%7)===((d[i-1]+6)%7)+1);
  return (run?sh(d[0])+'–'+sh(d[d.length-1]):d.map(sh).join(', '))+' '+w.r.map(r=>agH(r[0])+'–'+agH(r[1])).join(', ')}).join(' · ')}
function agTeamTxt(e){return (e.who||[]).map(id=>(db.people.find(p=>p.id===id)||{}).nom).filter(Boolean).join(', ')}
function agCard(ev,ck,day){const c=ev.cid&&db.clients.find(x=>x.id===ev.cid),tm=agTeamTxt(ev);
 return `<div class="ag-card${ev.t==='off'?' off':''}"><div class="ag-cd"><b data-noi18n>${esc(agFmtD(day||ev.d))}${ev.d2&&ev.d2!==ev.d?' → '+esc(agFmtD(ev.d2)):''}</b><span data-noi18n>${esc(ev.t==='off'?(ev.a?agFmtR(ev):i18nT('Toute la journée')):agFmtR(ev))}</span></div>
  <div class="ag-ct"><b data-noi18n dir="auto">${esc(ev.title||(ev.t==='off'?i18nT('Indisponible'):i18nT('Rendez-vous')))}</b>${c?`<span class="mut"><svg class="i i-sm"><use href="#i-user"/></svg> <span data-noi18n>${esc(c.nom)}</span></span>`:''}${tm?`<span class="mut"><svg class="i i-sm"><use href="#i-users"/></svg> <span data-noi18n>${esc(tm)}</span></span>`:''}${ev.rr?`<span class="mut"><svg class="i i-sm"><use href="#i-undo"/></svg> <span data-noi18n>${esc(agRrTxt(ev))}</span></span>`:''}</div>
  ${ck&&ck.hors?`<p class="ag-warn"><svg class="i i-sm"><use href="#i-warn"/></svg> <span>En dehors de tes créneaux de travail.</span></p>`:''}
  ${ck&&ck.over.length?`<p class="ag-warn"><svg class="i i-sm"><use href="#i-warn"/></svg> <span>Chevauche</span> : <span data-noi18n>${esc(ck.over.map(e=>(e.title||'')+' '+agFmtR(e)).join(', '))}</span></p>`:''}</div>`}

/* ---- 5. le chat ---- */
function agUndoLast(){
 const m=CHAT.m[CHAT.m.length-1];if(!m||!m.agUndo)return;const u=m.agUndo;
 if(u==='none')db.events=db.events.filter(e=>e.id!=='dispo');
 else if(u.startsWith('add:')){const [,id,cid]=u.split(':');db.events=db.events.filter(e=>e.id!==id);if(cid&&!db.quotes.some(x=>x.client&&db.clients.find(c=>c.id===cid&&nameKey(c.nom)===nameKey(x.client))))db.clients=db.clients.filter(c=>c.id!==cid)}
 else if(u.startsWith('del:'))db.events.push(JSON.parse(u.slice(4)));
 else if(u.startsWith('mv2:')){const [js,nid]=[u.slice(4,u.lastIndexOf('|')),u.slice(u.lastIndexOf('|')+1)],ev=JSON.parse(js),i=db.events.findIndex(e=>e.id===ev.id);if(i>=0)db.events[i]=ev;db.events=db.events.filter(e=>e.id!==nid)}
 else if(u.startsWith('mod:')){const ev=JSON.parse(u.slice(4)),i=db.events.findIndex(e=>e.id===ev.id);if(i>=0)db.events[i]=ev}
 else{const ev=JSON.parse(u),i=db.events.findIndex(e=>e.id==='dispo');if(i>=0)db.events[i]=ev}
 save();CHAT.m.pop();const me=CHAT.m[CHAT.m.length-1];if(me&&me.who==='me'){$('chatIn').value=me.text;CHAT.m.pop()}chatSave();chatRender()}

/* ---- 6. notification « Nouveau client ajouté ! » ---- */
function agNotify(cl,ev){
 let b=$('agBan');if(!b){b=document.createElement('div');b.id='agBan';b.className='ag-ban';b.setAttribute('role','status');document.body.appendChild(b)}
 b.innerHTML=`<span class="ag-ban-i"><svg class="i"><use href="#i-user"/></svg></span><div class="ag-ban-t"><b>Nouveau client ajouté !</b><span data-noi18n>${esc(cl.nom)}</span></div>
  <button class="btn sm" onclick="agBanClose();agQuote('${cl.id}','${ev?ev.id:''}')">Préparer un devis ?</button><button class="ag-ban-x" onclick="agBanClose()" aria-label="Fermer"><svg class="i i-sm"><use href="#i-x"/></svg></button>`;
 b.hidden=false;requestAnimationFrame(()=>b.classList.add('on'));clearTimeout(b._t);b._t=setTimeout(agBanClose,9000);
 try{if(document.hidden&&window.Notification&&Notification.permission==='granted'){const ttl=i18nT('Nouveau client ajouté !');
  if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(ttl,{body:cl.nom,tag:'cli-'+cl.id})).catch(()=>{new Notification(ttl,{body:cl.nom})});else new Notification(ttl,{body:cl.nom})}}catch(e){}}
function agBanClose(){const b=$('agBan');if(!b)return;b.classList.remove('on');setTimeout(()=>{b.hidden=true},250)}
/* ---- vocabulaire enrichi : autres façons courantes de dire la même chose ---- */
[['en',[["what's on|whats on|what have i got|what's my day|whats my day|my appointments|show me my schedule|show my schedule|my diary","mon planning"],['call off|scrap','annule'],['move back|bring forward|change the time of','deplace'],['visit','rdv']]],
 ['es',[['qué hay|que hay|mis citas|mi horario|qué tengo que hacer|que tengo que hacer','mon planning'],['retrasa|adelanta|traslada','deplace'],['visita|reunión|reunion','rdv']]],
 ['pt',[['o que há|o que ha|os meus compromissos|meus compromissos|minhas marcações|minhas marcacoes|o que tenho que fazer','mon planning'],['desmarca|cancelar','annule'],['adiar|antecipa|transfere','deplace'],['visita|reunião|reuniao|compromisso','rdv']]],
 ['it',[["che ho|cos'ho|cos ho|cosa c'è|cosa ce|i miei appuntamenti|che impegni ho","mon planning"],['disdici','annule'],['anticipa|posticipa|rinvia','deplace'],['visita|riunione|incontro','rdv']]],
 ['ro',[['ce am de făcut|ce am de facut|programările mele|programarile mele|ce e programat','mon planning'],['renunță la|renunta la','annule'],['reprogramează|reprogrameaza|schimbă|schimba','deplace'],['vizită|vizita|ședință|sedinta','rdv']]],
 ['tr',[['programımda ne var|programimda ne var|ne işim var|ne isim var|neler var|ne var|randevularım|randevularim','mon planning'],['vazgeç|vazgec','annule'],['değiştir|degistir|kaydır|kaydir|öne al|one al','deplace'],['ziyaret|toplantı|toplanti|buluşma|bulusma','rdv']]],
 ['pl',[['co mam zaplanowane|co mam do zrobienia|moje spotkania|moje wizyty|mój grafik|moj grafik','mon planning'],['skasuj|anuluj|wykreśl|wykresl','annule'],['zmień termin|zmien termin|przenieś|przenies','deplace']]],
 ['ru',[['забронирую|зарезервирую|запишу|поставлю','reserve'],['что запланировано|какие планы|мои встречи|мои записи','mon planning'],['отменить|отмена','annule'],['перенести|сдвинь|переставь|измени время','deplace'],['визит|приём|прием','rdv']]],
 ['ar',[['ماذا عندي|شنو عندي|اش عندي|واش عندي|شو عندي|ايش عندي|ماذا يوجد|ما هي مواعيدي','mon planning'],['الغاء|إلغاء','annule'],['غير الموعد|بدل الموعد','deplace'],['زيارة|اجتماع','rdv']]]
].forEach(([l,E])=>{if(AG_LEX[l])AG_LEX[l].unshift(...E)});
/* ---- Chat : comprend les fautes de frappe et d'orthographe (10 langues) ---- */
// abréviations et écritures SMS courantes, par langue (mot replié -> mot compris par le chat)
const FZ_AB={
 fr:"dm1=demain|2m1=demain|dmain=demain|dmn=demain|dem1=demain|ajd=aujourd'hui|auj=aujourd'hui|ojd=aujourd'hui|aujd=aujourd'hui|aprem=après-midi|aprm=après-midi|apm=après-midi|pr=pour|ds=dans|qd=quand|bcp=beaucoup|tjr=toujours|tjrs=toujours|rdz=rdv|rdzv=rdv|rdvs=rdv|rendez=rendez-vous|mdo=main d'œuvre|fact=facture|fac=facture|fourn=fournisseur|frs=fournisseur|cli=client|sdb=salle de bain|sem=semaine|proch=prochain|pcq=parce que|pk=pourquoi|koi=quoi|ki=qui|ke=que|mm=même|ptit=petit|ptite=petite|lun=lundi|mer=mercredi|jeu=jeudi|ven=vendredi|sam=samedi|dim=dimanche|mrd=mercredi|vdi=vendredi|sam=samedi|hr=h|hrs=h|hres=heures|mn=min|cb=carte|chq=chèque|esp=espèces|vir=virement|tt=tout|svp=stp|jai=j'ai|cest=c'est|quest=qu'est|kest=qu'est|jsuis=je suis|chui=je suis|jfais=je fais|jdois=je dois|chai=je sais",
 en:'tmrw=tomorrow|tmr=tomorrow|tmw=tomorrow|tmrrw=tomorrow|tomoz=tomorrow|2moro=tomorrow|2morrow=tomorrow|tdy=today|2day=today|nxt=next|wk=week|appt=appointment|apt=appointment|pls=please|plz=please|ur=your|tues=tuesday|thurs=thursday|thur=thursday|weds=wednesday|hr=h|hrs=h|mins=min|asap=asap|inv=invoice|qte=quote|cust=customer',
 es:'mñn=mañana|mñna=mañana|mna=mañana|mnn=mañana|hy=hoy|xq=porque|pq=porque|porq=porque|tb=también|tmb=también|tmbn=también|sem=semana|prox=próximo|pres=presupuesto|presu=presupuesto|fact=factura|cli=cliente|hr=h|hrs=h',
 pt:'amnh=amanhã|amn=amanhã|amnha=amanhã|hj=hoje|vc=você|vcs=vocês|pq=porque|tb=também|tbm=também|prox=próximo|orc=orçamento|orç=orçamento|fat=fatura|cli=cliente|hr=h|hrs=h',
 it:'dmn=domani|dmani=domani|cmq=comunque|nn=non|xke=perché|xké=perché|xchè=perché|prox=prossimo|prev=preventivo|fatt=fattura|cli=cliente|hr=h',
 ro:'pt=pentru|ptr=pentru|dc=de ce|mn=mâine|mne=mâine|maine=mâine|azi=azi|sapt=săptămâna|sapt=săptămâna|fact=factura|cli=client|ora=ora',
 tr:'yrn=yarın|yrin=yarın|bgn=bugün|bugn=bugün|tmm=tamam|slm=selam|hft=hafta|cts=cumartesi|pzt=pazartesi|mus=müşteri|ft=fatura',
 pl:'jtr=jutro|jutr=jutro|dzs=dzisiaj|dzis=dzisiaj|dzisj=dzisiaj|nast=następny|nastp=następny|tydz=tydzień|pn=poniedziałek|pon=poniedziałek|wt=wtorek|sr=środa|czw=czwartek|pt=piątek|sob=sobota|ndz=niedziela|fakt=faktura|kl=klient',
 ru:'завтро=завтра|затра=завтра|зафтра=завтра|севодня=сегодня|сегоня=сегодня|зав=завтра|завтр=завтра|завт=завтра|сег=сегодня|седня=сегодня|сёдня=сегодня|сення=сегодня|щас=сейчас|ща=сейчас|пж=пожалуйста|плз=пожалуйста|пжл=пожалуйста|нед=неделя|пн=понедельник|вт=вторник|ср=среда|чт=четверг|пт=пятница|сб=суббота|вс=воскресенье',
 ar:'بكره=غدا|بكرا=غدا|بكرة=غدا|اليوم=اليوم'};
// expressions écrites en plusieurs morceaux (ou collées)
const FZ_PH=[[/(^|[^\p{L}])rende?[sz]?[\s-]*vou?s?(?![\p{L}])/giu,'$1rendez-vous'],
 [/(^|[^\p{L}])main[\s-]*(?:d['’\s-]?\s*)?(?:œ|oe|e|o)u?vres?(?![\p{L}])/giu,"$1main d'œuvre"],
 [/(^|[^\p{L}])(?:au|o)jou?rd?['’\s]?h?ui(?![\p{L}])/giu,"$1aujourd'hui"],
 [/(^|[^\p{L}])apr[eè]s?[\s-]*midi(?![\p{L}])/giu,'$1après-midi'],
 [/(^|[^\p{L}])s['’\s]?il\s*(?:te|vous)\s*pla[iî]t(?![\p{L}])/giu,'$1stp'],
 [/(^|[^\p{L}])to[\s-]+morrow(?![\p{L}])/giu,'$1tomorrow'],
 [/(^|[^\p{L}])pasado[\s-]*ma(?:ñ|n|nn)ana(?![\p{L}])/giu,'$1pasado mañana']];
// mot qui annonce un nom de personne : le mot suivant n'est corrigé que vers un client connu
const FZ_NAMEPREV=new Set('chez client cliente clients cliente mme madame monsieur mr mrs ms miss mlle mademoiselle m mister sir senor sr sra senora señor señora don dona signor signora sig domnul doamna dl dna bay bayan pan pani panu pana panem господин госпожа клиент клиента клиенту клиентка у السيد السيدة عند لدى pour for para per pentru dla для için icin'.split(' '));
const FZ={L:{},all:null,raw:null};
function fzF(s){return String(s).toLowerCase().replace(/ı/g,'i').replace(/ł/g,'l').replace(/ß/g,'ss').replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/ø/g,'o').normalize('NFD').replace(/[̀-ًͯ-ٰٟـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي')}
function fzArRx(a){let o='',k=0;for(const ch of a){if(ch==='[')k++;else if(ch===']')k--;o+=k?ch:/[اأإآ]/.test(ch)?'[اأإآ]':/[هة]/.test(ch)?'[هة]':/[يى]/.test(ch)?'[يى]':ch}return o}
function fzArF(s){return String(s).replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')}
function fzSk(f){return f.replace(/(.)\1+/gu,'$1')}
function fzData(){if(FZ.D)return FZ.D;let d={v:{},p:{}};try{d=JSON.parse(document.getElementById('fzData').textContent)}catch(e){}FZ.D=d;
 FZ.all=new Set();FZ.raw=new Map();for(const l in d.v)d.v[l].split(' ').forEach(w=>{if(!w)return;const f=fzF(w);FZ.all.add(f);if(!FZ.raw.has(f))FZ.raw.set(f,new Set());FZ.raw.get(f).add(w)});return d}
function fzLang(l){if(FZ.L[l])return FZ.L[l];const d=fzData();const C=[],seen=new Set();
 [...new Set([l,'x'])].forEach((g,gi)=>(d.v[g]||'').split(' ').forEach((w,r)=>{if(!w||w.length<3)return;const f=fzF(w);if(seen.has(f))return;seen.add(f);C.push({w,f,s:fzSk(f),r,g:g===l?0:1})}));
 const P=new Set((d.p[l]||'').split(' '));
 const AB=new Map();[l].forEach(g=>(FZ_AB[g]||'').split('|').forEach(x=>{const i=x.indexOf('=');if(i>0){const k=fzF(x.slice(0,i));if(!AB.has(k))AB.set(k,x.slice(i+1))}}));
 const O=new Set();[l,'k'].forEach(g=>(d.v[g]||'').split(' ').forEach(w=>{if(w)O.add(fzF(w))}));
 const DK=[...AB.keys()].filter(k=>/\d/.test(k));const ABD=DK.length?new RegExp('(^|[^\\p{L}\\d])('+DK.join('|')+')(?![\\p{L}\\d])','giu'):null;
 return FZ.L[l]={C,P,AB,O,ABD}}
// distance d'édition (lettre en trop, en moins, remplacée, deux lettres inversées), arrêt dès que > mx
function fzD(a,b,mx){const la=a.length,lb=b.length;if(Math.abs(la-lb)>mx)return mx+1;let p2=null,p=[];for(let j=0;j<=lb;j++)p[j]=j;
 for(let i=1;i<=la;i++){const c=[i];let lo=i;for(let j=1;j<=lb;j++){let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])v=Math.min(v,p2[j-2]+1);c[j]=v;if(v<lo)lo=v}
  if(lo>mx)return mx+1;p2=p;p=c}return p[lb]}
function fzSub(a,b){let i=0;for(const ch of b)if(ch===a[i])i++;return i===a.length}
function fzTh(n){return n<4?0:n<9?1:2}
function fzDyn(){const N=[],S=[],K=new Set();
 const add=(arr,w,name)=>{if(!w||w.length<3)return;const f=fzF(w);if(K.has(f))return;K.add(f);arr.push({w:name?w:w.toLowerCase(),f,s:fzSk(f),r:0,g:0,name})};
 (db.clients||[]).concat(db.people||[]).forEach(c=>String(c.nom||'').split(/[^\p{L}'’-]+/u).forEach(w=>add(N,w,1)));
 (db.prices||[]).forEach(p=>String(p.nom||'').split(/[^\p{L}]+/u).forEach(w=>add(S,w,0)));
 return{N,S,K}}
function fzEnd(f,c,l){let i=0;while(i<f.length&&i<c.length&&f[i]===c[i])i++;
 if(i<f.length-2||i<c.length-2)return false;
 // mot coupé d'une lettre à la fin (« peintur ») : faute, en français et en anglais
 if((l==='fr'||l==='en')&&c.length===f.length+1&&c.startsWith(f)&&f.length>=5)return false;
 // les lettres qui changent sont-elles des terminaisons de la langue (pluriel, conjugaison, déclinaison) ?
 if(l==='tr'&&f.length<c.length)return false;// turc : les suffixes allongent le mot, un mot plus court est une lettre oubliée
 const A=FZ_END[l]||'';return [...f.slice(i)+c.slice(i)].every(ch=>A.includes(ch))}
const FZ_END={fr:'aeisrtzn',en:'sedrngiy',es:'aeiosrnd',pt:'aeiosrnmd',it:'aeiorn',ro:'aeiulst',pl:'aeiouymchw',ru:'аяуюеыиоймхьвтшл',tr:'aeiouyldtmrsnkcg',ar:'هيكاتنوم'};
function fzLess(a,b){for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]<b[i]}return false}
function fzBest(f,L,mx){let b=null,bk=null;const sk=fzSk(f);
 for(const c of L){if(f.length===4&&c.f.length<4)continue;let d;
  if(c.s===sk)d=0.5;else{if(mx<1||Math.abs(c.f.length-f.length)>mx)continue;d=fzD(f,c.f,mx);if(d>mx)continue}
  if(d>=1&&fzEnd(f,c.f,FZ.lang))continue;
  const k=[d,fzSub(f,c.f)?0:1,c.g,c.r];
  if(!bk||fzLess(k,bk)){b=c;bk=k}}
 return b}
function fzCase(src,w){if(src.length>1&&src===src.toUpperCase()&&src!==src.toLowerCase())return w.toUpperCase();return /^\p{Lu}/u.test(src)?w.charAt(0).toUpperCase()+w.slice(1):w}
// prépare le dictionnaire dès que l'usager touche la zone de texte (la première phrase n'attend pas)
document.addEventListener('focusin',e=>{if(e.target&&e.target.id==='chatIn'&&!FZ.D)setTimeout(()=>{try{fzLang((VN&&VN.lang)||'fr')}catch(x){}},30)});
/** Corrige les fautes d'une phrase du chat. Renvoie la phrase comprise (identique s'il n'y a rien à corriger). */
function chatFix(t,lang){
 const d=fzData();lang=d.v&&d.v[lang]?lang:'fr';FZ.lang=lang;const Z=fzLang(lang),Y=fzDyn();
 let s=String(t);FZ_PH.forEach(([re,b])=>{s=s.replace(re,b)});
 if(Z.ABD)s=s.replace(Z.ABD,(m,a,k)=>a+Z.AB.get(fzF(k)));
 const skip=[];s.replace(/\S*(?:@|:\/\/|www\.)\S*/g,(m,o)=>{skip.push([o,o+m.length]);return m});
 let prev='',prevEnd=-1;
 return s.replace(/[\p{L}\p{M}]+/gu,(w,o)=>{
  const f=fzF(w),start=!s.slice(0,o).trim()||/[.!?:\n]\s*$/.test(s.slice(0,o)),glued=prevEnd===o-1&&/['’]/.test(s[o-1]||'');
  const slot=!glued&&(FZ_NAMEPREV.has(prev)||(!start&&/^\p{Lu}/u.test(w)));prev=f;prevEnd=o+w.length;
  if(skip.some(([a,b])=>o>=a&&o<b)||/\d/.test(s[o-1]||'')||/\d/.test(s[o+w.length]||''))return w;
  if(Y.K.has(f))return w;
  if(FZ.all.has(f)){
   // mot d'une autre langue : on le garde, sauf s'il ne diffère d'un mot de cette langue que par une lettre doublée (terase -> terrasse)
   if(!slot&&!Z.O.has(f)&&f.length>=4){const c=fzBest(f,Z.C,0);if(c&&c.f!==f)return fzCase(w,c.w)}
   // même mot à l'accent près : on garde ce que l'usager a tapé, on ajoute seulement les accents oubliés (creneau -> créneau)
   const lw=w.toLowerCase(),R=FZ.raw.get(f),ar=/[\u0600-\u06FF]/.test(w);if(slot||R.has(lw)||(lw!==f&&!ar))return w;const ac=[...R].find(x=>x!==f)||(ar?[...R][0]:null);return ac?fzCase(w,ac):w}
  // arabe : préfixes collés (و ب ل ف ال) : on ne corrige que le mot qui suit le préfixe
  if(/[\u0600-\u06FF]/.test(w)){for(const pf of ['وال','بال','لل','ال','و','ب','ل','ف']){if(f.startsWith(pf)&&f.length-pf.length>=3){const st=f.slice(pf.length);
   if(FZ.all.has(st)||Z.P.has(st)||Y.K.has(st))return w;if(st.length<4||Z.P.has(f))return w;const c=fzBest(st,Z.C,1);return c?w.slice(0,pf.length)+c.w:w}}}
  if(!slot&&Z.AB.has(f))return fzCase(w,Z.AB.get(f));
  if(f.length<4||Z.P.has(f))return w;
  const mx=fzTh(f.length);
  // un nom de personne n'est jamais changé ici : le choix du client se fait dans la liste (cliMatches)
  if(slot)return w;
  const c=fzBest(f,Y.S.concat(Z.C),mx);return c?fzCase(w,c.w):w})}
/* ---- « main d'œuvre 50€ » : prix d'un service ---- */
const PR_LEAD=/^(?:(?:change|changer|modifie|modifier|mets|met|mettre|passe|passer|fixe|fixer|nouveau|nouvelle|enregistre|set|update|change|cambia|actualiza|muda|altera|cambia|aggiorna|modifica|schimba|seteaza|degistir|zmien|ustaw|измени|поставь|غير|عدل)\s+)?(?:(?:le|la|mon|ma|mes|the|my|el|mi|o|meu|il|mio|pretul|cena|цену|السعر)\s+)?(?:(?:prix|tarif|price|rate|precio|preco|preço|prezzo|pret|preț|fiyat|cena|цена|سعر)\s+(?:de\s+la\s+|de\s+l'|du\s+|des\s+|de\s+|d'|pour\s+(?:la\s+|le\s+|l')?|of\s+(?:the\s+)?|for\s+(?:the\s+)?|del\s+|da\s+|do\s+|della\s+|dello\s+|di\s+|pentru\s+|за\s+|на\s+)?)?/i;
const PR_UNIT=[[/^(m2|m²|metres? carres?|mètres? carrés?|le m2|le m²|sqm)$/i,'m²'],[/^(ml|metre lineaire|mètre linéaire|le ml|m)$/i,'ml'],[/^(m3|m³)$/i,'m³'],[/^(h|heure|l'heure|de l'heure|hour|hr|hora|ora|saat|godz|час|ساعة)$/i,'h'],[/^(jour|j|journee|journée|day|dia|día|giorno|zi|gun|gün|dzien|день|يوم)$/i,'jour'],[/^(forfait|flat|fixed)$/i,'forfait'],[/^(u|unite|unité|piece|pièce|unit|pce)$/i,'u']];
const PR_ADD=/^(?:ajoute|ajouter|ajoutes|rajoute|rajouter|mets|met|mettre|insere|inserer|add|put|anade|agrega|pon|adiciona|coloca|aggiungi|metti|adauga|pune|ekle|dodaj|добавь|أضف|اضف)(?:[\s-]+(?:moi|nous|me|-moi|-nous))?(?:\s+(?:au|sur le|dans le|to the|to my|al|ao|nel|в)\s+(?:devis|quote|presupuesto|orcamento|orçamento|preventivo|deviz|teklif|kosztorys|смету))?\s+/i;
function prParse(t){let raw=String(t).trim().replace(/\s+/g,' ');let add=PR_ADD.test(raw);if(add)raw=raw.replace(PR_ADD,'');
 /* « ajoute un service : pose de parquet 35 € le m² » : un service à enregistrer (pas une ligne), sans « Service : » dans son nom */
 {const sv=/^(?:(?:nouveau|nouvelle|un|une|le|mon)\s+)?(?:service|prestation)\s*:?\s+(?=\p{L})/iu;if(sv.test(raw)){raw=raw.replace(sv,'');add=false}}
 const m=/^(.*?)(?:\s*(?:[:=]|->|→))?(?:\s+(?:à|a|est de|est à|est a|c'est|coûte|coute|vaut|au prix de|is|costs?|cuesta|costa|kosztuje|стоит))?\s*(\d+(?:[.,]\d{1,2})?)\s*(?:€|euros?|eur)(?![\p{L}])\.?\s*(?:ht|ttc)?\s*(?:(?:le|la|les|par|per|por|pour|the|de)\s+|\/\s*)?(?:l')?([\p{L}²³0-9' ]{0,24}?)\s*(?:ht|ttc)?\s*[.!]?$/iu.exec(raw);
 if(!m)return null;let name=m[1].replace(PR_LEAD,'').replace(/^(le|la|les|l'|un|une|the|el|la|il|o|a)\s+/i,'').replace(/[\s:,-]+$/,'').trim();
 if(name.length<2||name.length>60||/\d/.test(name)||!/\p{L}/u.test(name))return null;
 if(/^(total|acompte|remise|tva|reste|solde|arrondis?|arrondir|arrondit)$/i.test(vnNorm(name)))return null;
 if(/^(client|cliente|fournisseur|chez|pour|mme|mlle|m\.|monsieur|madame|acompte|remise|facture|devis)(\s|$)/i.test(vnNorm(name)))return null;
 const u0=(m[3]||'').trim();let unit=null;if(u0){const e=PR_UNIT.find(([re])=>re.test(u0));if(!e)return null;unit=e[1]}
 return{name,prix:Math.round(parseFloat(m[2].replace(',','.'))*100)/100,unit,add}}
function prFind(name){const k=vnNorm(name).replace(/[^\p{L}0-9]+/gu,' ').trim(),P=db.prices||[];
 const norm=p=>vnNorm(p.nom).replace(/[^\p{L}0-9]+/gu,' ').trim();
 return P.find(p=>norm(p)===k)||(()=>{const L=P.filter(p=>{const n=norm(p);return k.length>3&&(n.startsWith(k+' ')||n.endsWith(' '+k))});return L.length===1?L[0]:null})()}
function prixChat(t){const x=prParse(t);if(!x)return false;
 if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};
 if(x.add&&(q.client||(q.lines||[]).some(l=>l.label||l.pu)))return prAddLine(t,x);
 CHAT.m.push({who:'me',text:t});
 let p=prFind(x.name),undo,html;
 if(p){undo={id:p.id,prev:{prix:p.prix,unit:p.unit}};const old=+p.prix||0;p.prix=x.prix;if(x.unit)p.unit=x.unit;
  html=`<p><svg class="i i-sm"><use href="#i-tag"/></svg> <span>Prix mis à jour</span> : <b data-noi18n lang="fr">${esc(p.nom)}</b></p><p><span class="mut" data-noi18n>${eur(old)}</span> → <b data-noi18n>${eur(p.prix)} / ${esc(p.unit||'')}</b></p>`}
 else{const unit=x.unit||(/main d.?oeuvre|heure/.test(vnNorm(x.name))?'h':'forfait');
  p={id:uid(),nom:x.name.charAt(0).toUpperCase()+x.name.slice(1),unit,prix:x.prix,tva:20,four:''};db.prices.push(p);undo={id:p.id,prev:null};
  html=`<p><svg class="i i-sm"><use href="#i-tag"/></svg> <span>Nouveau service enregistré</span> : <b data-noi18n lang="fr">${esc(p.nom)}</b></p><p><b data-noi18n>${eur(p.prix)} / ${esc(p.unit)}</b> <span class="mut">· <span>TVA</span> <span data-noi18n>20 %</span></span></p>`}
 save();
 // le devis ouvert contient ce service à un autre prix : on propose de le mettre à jour aussi
 const inQ=(q.lines||[]).some(l=>l.label&&vnNorm(l.label)===vnNorm(p.nom)&&+l.pu!==+p.prix);
 html+=`<div class="msg-act"><button class="btn sm sec" onclick="go('prix')"><svg class="i"><use href="#i-tag"/></svg>Mes services</button>${inQ?`<button class="btn sm" onclick="prToQuote('${p.id}')"><svg class="i"><use href="#i-quote"/></svg>Appliquer aussi à ce devis</button>`:''}</div>`;
 CHAT.m.push({who:'bot',html,prUndo:undo});chatSave();chatRender(true);
 if($('s-prix')&&$('s-prix').classList.contains('on'))renderPrices();return true}
function prAddLine(t,x){const p=prFind(x.name);CHAT.m.push({who:'me',text:t});
 readForm();const before=JSON.stringify(q);
 /* la ligne est déjà au devis : son prix change, sa quantité reste (pas de deuxième ligne « 1 m² ») */
 {const k=vnNorm(p?p.nom:x.name),ex=(q.lines||[]).filter(y=>y.label&&vnNorm(y.label)===k);
  if(ex.length===1){const l=ex[0];l.pu=x.prix;if(x.unit&&l.qty==null)l.unit=x.unit;fillForm();store();const tt=totals(q),diff=p&&+p.prix!==x.prix;
   CHAT.m.push({who:'bot',undo:before,html:`<div class="msg-lines"><div class="ml"><div><b data-noi18n lang="fr">${esc(l.label)}</b><div class="mut" data-noi18n>${l.qty==null?'':fmtN(l.qty)+' '}${esc(l.unit)} × ${eur(l.pu)}</div></div><b>${l.qty==null?'':eur(l.qty*l.pu)}</b></div></div><div class="msg-tot"><span>Total du devis</span><b>${eur(tt.ttc)} TTC</b></div>`+
    `<div class="msg-act">${diff?`<button class="btn sm sec" onclick="prSave(this,'${p.id}',${x.prix})"><svg class="i"><use href="#i-tag"/></svg><span>Garder ce prix dans Mes services</span></button>`:''}<button class="btn sm sec" onclick="go('edit')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button></div>`});
   chatSave();chatRender(true);return true}}
 const l={label:p?p.nom:x.name.charAt(0).toUpperCase()+x.name.slice(1),qty:1,unit:x.unit||(p&&p.unit)||'forfait',pu:x.prix,tva:p&&p.tva!=null?+p.tva:20};
 q.lines=q.lines.filter(y=>y.label||y.pu);q.lines.push(l);fillForm();store();
 const tt=totals(q),diff=p&&+p.prix!==x.prix;
 CHAT.m.push({who:'bot',undo:before,html:`<div class="msg-lines"><div class="ml"><div><b data-noi18n lang="fr">${esc(l.label)}</b><div class="mut" data-noi18n>${l.qty==null?'':fmtN(l.qty)+' '}${esc(l.unit)} × ${eur(l.pu)}</div></div><b>${eur(l.qty*l.pu)}</b></div></div><div class="msg-tot"><span>Total du devis</span><b>${eur(tt.ttc)} TTC</b></div>`+
  `<div class="msg-act">${diff?`<button class="btn sm sec" onclick="prSave(this,'${p.id}',${x.prix})"><svg class="i"><use href="#i-tag"/></svg><span>Garder ce prix dans Mes services</span></button>`:''}${!p?`<button class="btn sm sec" data-n="${esc(l.label)}" data-u="${esc(l.unit)}" onclick="prSave(this,'',${x.prix})"><svg class="i"><use href="#i-tag"/></svg><span>Ajouter à Mes services</span></button>`:''}<button class="btn sm sec" onclick="go('edit')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button><button class="btn sm" onclick="goSign()"><svg class="i"><use href="#i-pen"/></svg>Valider le devis</button></div>`});
 chatSave();chatRender(true);return true}
function prSave(btn,id,prix){let p=id&&(db.prices||[]).find(x=>x.id===id);
 if(p)p.prix=prix;else{p={id:uid(),nom:btn.dataset.n,unit:btn.dataset.u||'forfait',prix,tva:20,four:''};db.prices.push(p)}
 save();btn.remove();toast(i18nT(id?'Prix mis à jour':'Nouveau service enregistré'))}
function prToQuote(id){const p=(db.prices||[]).find(x=>x.id===id);if(!p)return;readForm();
 q.lines.forEach(l=>{if(l.label&&vnNorm(l.label)===vnNorm(p.nom)){l.pu=+p.prix;if(p.unit)l.unit=p.unit}});fillForm();store();toast(i18nT('Devis mis à jour.'))}
function prUndoLast(){const m=CHAT.m[CHAT.m.length-1];if(!m||!m.prUndo)return;const u=m.prUndo;
 if(u.prev){const p=db.prices.find(x=>x.id===u.id);if(p){p.prix=u.prev.prix;p.unit=u.prev.unit}}else db.prices=db.prices.filter(x=>x.id!==u.id);
 save();CHAT.m.pop();const me=CHAT.m[CHAT.m.length-1];if(me&&me.who==='me'){$('chatIn').value=me.text;CHAT.m.pop()}chatSave();chatRender()}
/* ---- « ajoute mes services au devis » ---- */
const SVC_V=/(?:^|[^\p{L}])(ajoute|ajouter|ajoutes|rajoute|rajouter|mets|met|mettre|insere|inserer|integre|add|put|insert|anade|agrega|agregar|pon|mete|adiciona|acrescenta|coloca|poe|aggiungi|metti|inserisci|adauga|pune|ekle|dodaj|wstaw|добавь|добавить|вставь|أضف|اضف|ضع)(?![\p{L}])/u,
 SVC_N=/(?:^|[^\p{L}])(prix|services?|tarifs?|prestations?|prices|services|rates|precios|servicios|tarifas|precos|servicos|prezzi|servizi|tariffe|preturile|serviciile|preturi|servicii|fiyatlarimi|fiyatlari|hizmetlerimi|hizmetleri|ceny|uslugi|usługi|цены|услуги|расценки|أسعاري|خدماتي|الأسعار|الخدمات)(?![\p{L}])/u;
function svcIs(t){const f=agFold(t);return SVC_V.test(f)&&SVC_N.test(f)&&!/\d\s*(m2|m²|ml|m3|€|euros?|eur\b|h\b)/.test(f)}
function svcSurf(txt){const m=/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|metres? carres?|mètres? carrés?)/i.exec(txt||'');return m?parseFloat(m[1].replace(',','.')):null}
function svcChat(t){if(!svcIs(t))return false;
 if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};
 const rm=[...CHAT.m].reverse().find(m=>m.who==='bot'&&m.ev),ev=rm&&db.events.find(e=>e.id===rm.ev),cl=ev&&ev.cid&&db.clients.find(c=>c.id===ev.cid);
 const ctx=[ev&&ev.title,ev&&ev.note,...CHAT.m.filter(m=>m.who==='me').map(m=>m.text)].filter(Boolean).join(' ');
 // le rendez-vous a un client : le devis est créé pour lui (ou on reprend celui déjà commencé)
 if(cl){const ex=ev.qid&&db.quotes.find(x=>x.id===ev.qid&&!(x.sign&&x.sign.st==='signed'));
  if(ex){q=JSON.parse(JSON.stringify(ex));fillForm()}
  else if(!(q.client&&nameKey(q.client)===nameKey(cl.nom))){chatNew();q.client=cl.nom;q.tel=cl.tel||'';q.adr=cl.adr||ev.adr||'';fillForm();store();ev.qid=q.id;save()}
  else{ev.qid=q.id;save()}
  if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]}}
 CHAT.m.push({who:'me',text:t});
 const P=db.prices||[];
 if(!P.length){CHAT.m.push({who:'bot',html:`<p>Tu n'as pas encore de services enregistrés. Ajoute-les dans « Mes services ».</p><div class="msg-act"><button class="btn sm" onclick="go('prix')"><svg class="i"><use href="#i-tag"/></svg>Mes services</button></div>`});chatSave();chatRender(true);return true}
 const surf=svcSurf(ctx),words=new Set(vnNorm(ctx).split(/[^\p{L}0-9]+/u).filter(w=>w.length>3));
 const hit=p=>vnNorm(p.nom).split(/[^\p{L}0-9]+/u).some(w=>w.length>3&&words.has(w));
 const m2=u=>/^(m2|m²)$/i.test(String(u||'').trim());
 const rows=P.slice(0,60).map(p=>`<label class="svc-r"><input type="checkbox" data-p="${esc(p.id)}"${hit(p)?' checked':''}><span class="svc-n"><b data-noi18n lang="fr">${esc(p.nom)}</b><small class="mut" data-noi18n>${eur(+p.prix||0)} / ${esc(p.unit||'')}</small></span><input class="svc-q" inputmode="decimal" aria-label="Quantité" value="${m2(p.unit)&&surf?String(surf).replace('.',','):'1'}" data-noi18n></label>`).join('');
 CHAT.m.push({who:'bot',html:`<!--sg--><div class="sugg svc-box"><p><svg class="i i-sm"><use href="#i-tag"/></svg> <span>Choisis les services à ajouter au devis</span>${q.client?` · <b data-noi18n>${esc(q.client)}</b>`:''}</p>${surf?`<p class="mut"><span>Surface reprise</span> : <b data-noi18n>${fmtN(surf)} m²</b></p>`:''}<div class="svc-l">${rows}</div><div class="msg-act"><button class="btn sm" onclick="svcAdd(this)"><svg class="i"><use href="#i-plus"/></svg>Ajouter au devis</button></div></div><!--/sg-->`});
 chatSave();chatRender(true);return true}
function svcAdd(btn){const box=btn.closest('.svc-box');if(!box)return;const add=[];
 box.querySelectorAll('.svc-r').forEach(r=>{const c=r.querySelector('input[type=checkbox]');if(!c.checked)return;const p=(db.prices||[]).find(x=>x.id===c.dataset.p);if(!p)return;
  const n=parseFloat(String(r.querySelector('.svc-q').value).replace(/\s/g,'').replace(',','.'));add.push({label:p.nom,qty:n>0?n:1,unit:p.unit||'',pu:+p.prix||0,tva:p.tva==null?20:+p.tva})});
 if(!add.length){toast(i18nT('Coche au moins un service.'));return}
 readForm();const before=JSON.stringify(q);q.lines=q.lines.filter(l=>l.label||l.pu);add.forEach(l=>q.lines.push(l));fillForm();store();
 const last=[...CHAT.m].reverse().find(m=>m.who==='bot'&&m.html&&m.html.includes('svc-box'));if(last)last.html=last.html.replace(/<!--sg-->[\s\S]*?<!--\/sg-->/,'');
 const tt=totals(q);
 CHAT.m.push({who:'bot',undo:before,html:`<div class="msg-lines">`+add.map(l=>`<div class="ml"><div><b data-noi18n lang="fr">${esc(l.label)}</b><div class="mut" data-noi18n>${l.qty==null?'':fmtN(l.qty)+' '}${esc(l.unit)} × ${eur(l.pu)}</div></div><b>${eur(l.qty*l.pu)}</b></div>`).join('')+`</div><div class="msg-tot"><span>Total du devis</span><b>${eur(tt.ttc)} TTC</b></div><div class="msg-act"><button class="btn sm sec" onclick="go('edit')"><svg class="i"><use href="#i-quote"/></svg>Voir le devis</button><button class="btn sm" onclick="goSign()"><svg class="i"><use href="#i-pen"/></svg>Valider le devis</button></div>`});
 chatSave();chatRender(true)}
function agQuote(cid,eid){
 const c=db.clients.find(x=>x.id===cid);if(!c)return;const ev=db.events.find(e=>e.id===eid);
 {const ex=ev&&ev.qid&&db.quotes.find(x=>x.id===ev.qid&&!(x.sign&&x.sign.st==='signed'));if(ex){q=JSON.parse(JSON.stringify(ex));fillForm();if(CHAT.qid!==q.id)CHAT={qid:q.id,m:[]};go('devis');return}}
 chatNew();q.client=c.nom;q.tel=c.tel||'';q.adr=c.adr||(ev&&ev.adr)||'';fillForm();store();
 if(ev){ev.qid=q.id;save()}
 chatPush({who:'bot',html:`<p><svg class="i i-sm"><use href="#i-quote"/></svg> <span>Nouveau devis pour</span> <b data-noi18n>${esc(c.nom)}</b>${ev?` · <span data-noi18n>${esc(agFmtD(ev.d))}</span>`:''}</p><p class="mut">Dis-moi les travaux et les quantités.</p>`});
 go('devis');
 const pm=ev&&ev.title&&db.prices.find(p=>{const k=vnNorm(p.nom);return k.length>3&&vnNorm(ev.title).includes(k.split(' ')[0])});
 if(pm)setTimeout(()=>chatSend(ev.title),60)}

/* ---- 7. écran « Mon planning » ---- */
let agSel=agToday(),agMode='jour',agEd=null;
function agOpen(d){if(d)agSel=d;go('agenda')}
function agPage(p){agMode=p;segOn('agSeg',p);document.querySelector('#s-agenda .ag-wk').style.display=$('agDays').style.display=$('agDispoT').style.display=p==='set'?'none':'';document.querySelectorAll('#s-agenda [data-ag]').forEach(e=>{e.style.display=e.dataset.ag===p?'':'none'});agRender()}
function agWeekStart(d){const x=agDate(d),k=(x.getDay()+6)%7;return agAdd(d,-k)}
function agShift(n){agSel=agAdd(agSel,n);agRender()}
function agOccurs(e,d){
 if(!e||e.t==='dispo')return false;
 if(!e.rr)return e.d<=d&&(e.d2||e.d)>=d;
 if(d<e.d||(e.rr.u&&d>e.rr.u)||(e.ex||[]).includes(d))return false;
 const x=agDate(d),s0=agDate(e.d);
 if(e.rr.f==='d')return true;
 if(e.rr.f==='m')return x.getDate()===s0.getDate();
 return (e.rr.days&&e.rr.days.length?e.rr.days:[s0.getDay()]).includes(x.getDay())}
function agNextOcc(e,from){from=from||agToday();for(let k=0;k<400;k++){const d=agAdd(from,k);if(agOccurs(e,d))return d}return null}
function agDayEvents(d){return db.events.filter(e=>agOccurs(e,d)).sort((a,b)=>(a.a||'').localeCompare(b.a||''))}
function agRrTxt(e){if(!e.rr)return'';const lc=I18N.lang==='fr'?'fr-FR':I18N.lang,u=e.rr.u?' · '+i18nT("jusqu'au {1}").replace('{1}',agFmtD(e.rr.u,{weekday:undefined})):'';
 if(e.rr.f==='d')return i18nT('Tous les jours')+u;if(e.rr.f==='m')return i18nT('Tous les mois')+u;
 const D=(e.rr.days&&e.rr.days.length?e.rr.days:[agDate(e.d).getDay()]).slice().sort((a,b)=>((a+6)%7)-((b+6)%7));
 return i18nT('Chaque {1}').replace('{1}',D.map(k=>new Date(2026,10,1+k).toLocaleDateString(lc,{weekday:'long'})).join(', '))+u}
function agRender(){
 if(!$('s-agenda').classList.contains('on'))return;
 const ws=agWeekStart(agSel),lc=I18N.lang==='fr'?'fr-FR':I18N.lang;
 try{$('agMonth').textContent=agDate(ws).toLocaleDateString(lc,{month:'long',year:'numeric'})}catch(e){}
 let h='';for(let i=0;i<7;i++){const d=agAdd(ws,i),x=agDate(d),n=agDayEvents(d).filter(e=>e.t==='rdv').length,free=agFreeRanges(d).length;
  h+=`<button class="ag-d${d===agSel?' on':''}${d===agToday()?' td':''}${free?'':' na'}" onclick="agSel='${d}';agRender()"><span data-noi18n>${esc(x.toLocaleDateString(lc,{weekday:'short'}).replace('.',''))}</span><b data-noi18n>${x.getDate()}</b><i>${n?'•'.repeat(Math.min(3,n)):''}</i></button>`}
 $('agDays').innerHTML=h;
 const dp=agDispo();$('agDispoT').innerHTML=dp&&dp.w.length?`<svg class="i i-sm"><use href="#i-clock"/></svg> <span data-noi18n>${esc(agDispoTxt(dp))}</span>`:`<svg class="i i-sm"><use href="#i-clock"/></svg> <span>Pas encore de créneaux de travail : dis-les dans le chat ou règle-les ici.</span>`;
 if(agMode==='jour')agRenderDay();else if(agMode==='sem')agRenderWeek();else agRenderSet()}
function agRenderDay(){
 const d=agSel,E=agDayEvents(d),F=agFreeRanges(d),PX=46;
 const tim=E.filter(e=>e.a);let h0=6,h1=21;tim.forEach(e=>{h0=Math.min(h0,Math.floor(agMin(e.a)/60));h1=Math.max(h1,Math.ceil((e.b?agMin(e.b):agMin(e.a)+60)/60))});
 {const dp=agDispo();if(dp&&dp.w&&dp.w.length)F.forEach(([a,b])=>{h0=Math.min(h0,Math.floor(a/60));h1=Math.max(h1,Math.ceil(b/60))})}h0=Math.max(0,h0);h1=Math.min(24,h1);
 const y=m=>(m/60-h0)*PX;let g='';
 for(let k=h0;k<=h1;k++)g+=`<div class="ag-hl" style="top:${y(k*60)}px"><span data-noi18n>${agP2(k)}:00</span></div>`;
 // zones indisponibles
 let cur=h0*60;const na=[];F.filter(([a,b])=>b>h0*60&&a<h1*60).forEach(([a,b])=>{if(a>cur)na.push([cur,a]);cur=Math.max(cur,b)});if(cur<h1*60)na.push([cur,h1*60]);
 na.forEach(([a,b])=>{g+=`<div class="ag-na" style="top:${y(a)}px;height:${y(b)-y(a)}px">${b-a>=45?'<span>Indisponible</span>':''}</div>`});
 // rendez-vous (colonnes en cas de chevauchement)
 const cols=[];tim.filter(e=>e.t==='rdv').forEach(e=>{const a=agMin(e.a),b=e.b?agMin(e.b):a+60;let c=0;while(cols[c]&&cols[c]>a)c++;cols[c]=b;e._c=c});
 const nc=Math.max(1,cols.length);
 tim.forEach(e=>{const a=agMin(e.a),b=e.b?agMin(e.b):a+60,ck=agCheck(e,d),c=e._c||0,cl=e.cid&&db.clients.find(x=>x.id===e.cid);
  g+=`<button class="ag-ev ${e.t}${ck.hors?' hors':''}" style="top:${y(a)}px;height:${Math.max(30,y(b)-y(a)-2)}px;left:calc(52px + (100% - 56px) * ${c}/${nc});width:calc((100% - 56px)/${nc} - 4px)" onclick="agEdit('${e.id}','${d}')"><b data-noi18n dir="auto">${e.rr?'<svg class="i i-sm ag-rri"><use href="#i-undo"/></svg>':''}${esc(e.title||i18nT(e.t==='off'?'Indisponible':'Rendez-vous'))}</b><span data-noi18n>${esc(agFmtR(e))}${cl?' · '+esc(cl.nom):''}${e.who&&e.who.length?' · '+esc(agTeamTxt(e)):''}</span></button>`});
 if(d===agToday()){const n=new Date(),m=n.getHours()*60+n.getMinutes();if(m>=h0*60&&m<=h1*60)g+=`<div class="ag-now" style="top:${y(m)}px"></div>`}
 const all=E.filter(e=>!e.a);
 $('agAll').innerHTML=all.map(e=>`<button class="ag-chip ${e.t}" onclick="agEdit('${e.id}','${d}')"><b data-noi18n dir="auto">${esc(e.title||i18nT(e.t==='off'?'Indisponible':'Rendez-vous'))}</b> <span>${e.t==='off'?'Indisponible':'Toute la journée'}</span></button>`).join('')+(!F.length&&!all.some(e=>e.t==='off')?`<div class="ag-chip off"><b>Indisponible</b> <span>toute la journée</span></div>`:'');
 $('agGrid').style.height=((h1-h0)*PX+8)+'px';$('agGrid').innerHTML=g;
 $('agDayT').textContent=agFmtD(d)}
function agRenderWeek(){
 const ws=agWeekStart(agSel);let h='';
 for(let i=0;i<7;i++){const d=agAdd(ws,i),E=agDayEvents(d),F=agFreeRanges(d);
  h+=`<div class="ag-wd${d===agToday()?' td':''}"><div class="ag-wh"><b data-noi18n>${esc(agFmtD(d,{month:'short'}))}</b>${F.length?(!agDispo()?'':`<span class="mut" data-noi18n>${esc(F.map(([a,b])=>agH(agHm(a))+'–'+agH(agHm(b))).join(', '))}</span>`):`<span class="ag-nat">Indisponible</span>`}</div>
   ${E.length?E.map(e=>{const ck=agCheck(e,d),cl=e.cid&&db.clients.find(x=>x.id===e.cid),tm=agTeamTxt(e);return `<button class="ag-li ${e.t}${ck.hors?' hors':''}" onclick="agEdit('${e.id}','${d}')"><span class="ag-lt" data-noi18n>${esc(e.a?agFmtR(e):i18nT('Toute la journée'))}</span><span class="ag-lb"><b data-noi18n dir="auto">${esc(e.title||i18nT(e.t==='off'?'Indisponible':'Rendez-vous'))}</b>${cl||tm?`<span class="mut" data-noi18n>${esc([cl&&cl.nom,tm].filter(Boolean).join(' · '))}</span>`:''}${e.rr?`<span class="mut ag-rrt" data-noi18n>${esc(agRrTxt(e))}</span>`:''}</span>${ck.hors?'<svg class="i i-sm ag-wi"><use href="#i-warn"/></svg>':''}</button>`}).join(''):`<p class="mut ag-empty">Rien de prévu.</p>`}</div>`}
 $('agWeek').innerHTML=`<div class="card ag-find"><h2><span class="hi"><svg class="i"><use href="#i-search"/></svg></span>Trouver un créneau libre</h2><div class="ag-fr"><select id="agFdur" aria-label="Durée"><option value="60">1 h</option><option value="120" selected>2 h</option><option value="180">3 h</option><option value="240">4 h</option><option value="480">Journée</option></select><button class="btn sm" onclick="agFindUI()"><svg class="i i-sm"><use href="#i-search"/></svg>Chercher</button></div><div id="agFres" class="ag-slots"></div></div>`+h}
function agRenderSet(){
 const dp=agDispo(),lc=I18N.lang==='fr'?'fr-FR':I18N.lang;let h='';
 [1,2,3,4,5,6,0].forEach(k=>{const w=dp&&dp.w.find(x=>x.d.includes(k)),r=w?w.r:[];const nm=new Date(2026,10,1+k).toLocaleDateString(lc,{weekday:'long'});
  h+=`<div class="ag-sr" data-k="${k}"><label class="pl-ck"><input type="checkbox" ${r.length?'checked':''} onchange="agSetTog(${k},this.checked)"> <span data-noi18n>${esc(nm)}</span></label>
   <div class="ag-rs">${r.length?r.map((x,i)=>`<span class="ag-rg"><input type="time" value="${x[0]}" onchange="agSetT(${k},${i},0,this.value)" aria-label="Début"><span>–</span><input type="time" value="${x[1]}" onchange="agSetT(${k},${i},1,this.value)" aria-label="Fin">${i?`<button class="ag-rx" onclick="agSetDel(${k},${i})" aria-label="Retirer"><svg class="i i-sm"><use href="#i-x"/></svg></button>`:''}</span>`).join('')+(r.length<2?`<button class="lnk" onclick="agSetAdd(${k})">+ Coupure</button>`:''):'<span class="mut">Indisponible</span>'}</div></div>`});
 const P=agRemPrefs(),c=getSync(),team=!!(c.url&&c.token),perm=window.Notification?Notification.permission:'denied';
 const h2=`<div class="card"><h2><span class="hi"><svg class="i"><use href="#i-clock"/></svg></span>Rappels</h2>
  <label class="pl-ck"><input type="checkbox" ${P.v?'checked':''} onchange="agRemSet('v',this.checked)"> <span>La veille à 18h</span></label>
  <label class="pl-ck"><input type="checkbox" ${P.h?'checked':''} onchange="agRemSet('h',this.checked)"> <span>1 h avant</span></label>
  <p class="mut pl-ex">${team?(notifOn()?'Rappels envoyés sur ton téléphone, même appli fermée.':'Active les notifications pour recevoir les rappels appli fermée.'):'Rappels affichés quand l\'appli est ouverte. Relie ton téléphone à ton entreprise (Mon équipe) pour les recevoir appli fermée.'}</p>
  ${team&&!notifOn()&&perm!=='denied'?`<button class="btn sec" onclick="enableNotif().then(()=>agRender())"><svg class="i"><use href="#i-check"/></svg>Activer les notifications</button>`:''}
  </div><div class="card"><h2><span class="hi"><svg class="i"><use href="#i-cal"/></svg></span>Agenda de l'iPhone</h2>
  <p class="mut pl-ex">${team?'Abonne ton Calendrier à ton planning casô : il se met à jour tout seul.':'Exporte ton planning vers le Calendrier du téléphone. Pour une mise à jour automatique, relie ton téléphone à ton entreprise (Mon équipe).'}</p>
  <button class="btn" onclick="agIcsSub()"><svg class="i"><use href="#i-cal"/></svg>${team?'S\'abonner dans Calendrier':'Exporter le planning (.ics)'}</button>
  <div id="agIcsBox" hidden><label for="agIcsUrl">Lien d'abonnement</label><div class="pl-in"><input id="agIcsUrl" readonly data-noi18n onclick="this.select()"><button class="btn sm sec" onclick="agIcsCopy()">Copier</button></div><p class="mut pl-ex">Sur iPhone : Réglages > Calendrier > Comptes > Ajouter un compte > Autre > Calendrier avec abonnement, puis colle ce lien.</p></div></div>`;
 $('agSet').innerHTML=h;$('agSet2').innerHTML=h2}
function agSetGet(){let dp=agDispo();if(!dp){dp={id:'dispo',t:'dispo',w:[]};db.events.push(dp)}
 // une règle par jour pour l'édition
 const M={};dp.w.forEach(w=>w.d.forEach(d=>{M[d]=w.r.map(r=>r.slice())}));return{dp,M}}
function agSetPut(dp,M){const G={};Object.keys(M).forEach(d=>{if(!M[d].length)return;const k=JSON.stringify(M[d]);(G[k]=G[k]||[]).push(+d)});dp.w=Object.keys(G).map(k=>({d:G[k],r:JSON.parse(k)}));save();agRender()}
function agSetTog(k,on){const {dp,M}=agSetGet();M[k]=on?(M[1]&&k!==1?M[1]:[['08:00','17:00']]):[];agSetPut(dp,M)}
function agSetT(k,i,j,v){if(!v)return;const {dp,M}=agSetGet();if(!M[k])return;M[k][i][j]=v;if(agMin(M[k][i][1])<=agMin(M[k][i][0])){toast(i18nT('La fin doit être après le début.'));agRender();return}agSetPut(dp,M)}
function agSetAdd(k){const {dp,M}=agSetGet();const r=M[k]||[];const last=r[r.length-1];r.push([last?agHm(Math.min(1380,agMin(last[1])+60)):'14:00',last?agHm(Math.min(1439,agMin(last[1])+240)):'18:00']);M[k]=r;agSetPut(dp,M)}
function agSetDel(k,i){const {dp,M}=agSetGet();M[k].splice(i,1);agSetPut(dp,M)}
// feuille d'édition
let agEdDay=null;
function agEdit(id,day){agEd=id?db.events.find(e=>e.id===id):null;agEdDay=day||null;const e=agEd||{t:'rdv',d:day||agSel,a:'08:00',b:'10:00',title:''};
 $('agEt').textContent=i18nT(agEd?'Modifier':'Nouveau rendez-vous');$('agEtyp').value=e.t;$('agEti').value=e.title||'';$('agEd').value=e.d;$('agEd2').value=e.d2||'';
 $('agEa').value=e.a||'';$('agEb').value=e.b||'';$('agEall').checked=!e.a;$('agEcl').value=e.cid?((db.clients.find(c=>c.id===e.cid)||{}).nom||''):'';$('agEadr').value=e.adr||'';$('agEno').value=e.note||'';
 $('agErr').value=e.rr?(e.rr.f==='w'&&e.rr.days&&e.rr.days.length>1?'w5':e.rr.f):'';$('agErr').dataset.v0=$('agErr').value;$('agEru').value=e.rr&&e.rr.u||'';
 ensurePt();$('agEwho').innerHTML=db.people.length?db.people.map(p=>`<label class="ag-who"><input type="checkbox" value="${p.id}" ${(e.who||[]).includes(p.id)?'checked':''}> <span data-noi18n>${esc(p.nom)}</span></label>`).join(''):`<span class="mut">Ajoute ton équipe dans Pointage.</span>`;
 $('agEch').innerHTML=`<option value="" data-noi18n>${esc(i18nT('Automatique (client ou adresse)'))}</option>`+db.chantiers.map(c=>`<option value="${c.id}" ${e.ch===c.id?'selected':''} data-noi18n>${esc(c.nom)}</option>`).join('');
 $('agEdel1').hidden=!(agEd&&agEd.rr);
 $('agEclDl').innerHTML=db.clients.map(c=>`<option value="${esc(c.nom)}">`).join('');agEdAll();
 $('agEdel').hidden=!agEd;$('agEq').hidden=!agEd||!e.cid;$('agEics').hidden=!agEd;$('agEpt').hidden=!agEd||agEd.t!=='rdv';
 $('agShBg').hidden=false;$('agSh').hidden=false;requestAnimationFrame(()=>{$('agSh').classList.add('on');$('agShBg').classList.add('on')})}
function agEdAll(){const a=$('agEall').checked;$('agEtimes').hidden=a;$('agEd2W').hidden=$('agEtyp').value!=='off'||!!$('agErr').value;$('agEruW').hidden=!$('agErr').value}
function agShClose(){$('agSh').classList.remove('on');$('agShBg').classList.remove('on');setTimeout(()=>{$('agSh').hidden=true;$('agShBg').hidden=true},200)}
function agSave(){
 const t=$('agEtyp').value,d=$('agEd').value,all=$('agEall').checked,a=all?null:$('agEa').value,b=all?null:$('agEb').value;
 if(!d){toast(i18nT('Choisis une date.'));return}
 if(!all&&(!a||(b&&agMin(b)<=agMin(a)))){toast(i18nT('La fin doit être après le début.'));return}
 const nm=$('agEcl').value.trim();let cl=null,isNew=false;if(nm){const r=upsert('clients',{nom:nm,adr:$('agEadr').value.trim()});cl=r.x;isNew=r.isNew}
 const e=agEd||{id:uid(),src:'main'},rv=$('agErr').value,ru=$('agEru').value,who=[...document.querySelectorAll('#agEwho input:checked')].map(x=>x.value);
 const rr=rv?(agEd&&agEd.rr&&rv===$('agErr').dataset.v0?Object.assign({},agEd.rr):(rv==='w5'?{f:'w',days:[1,2,3,4,5]}:{f:rv})):undefined;if(rr){delete rr.u;if(ru>d)rr.u=ru}
 // modifier une répétition depuis un jour : la répétition garde sa date de départ
 const d0=agEd&&agEd.rr&&rr&&agEdDay&&d===agEdDay?agEd.d:d;
 Object.assign(e,{t,d:d0,d2:t==='off'&&!rr&&$('agEd2').value>d?$('agEd2').value:undefined,a,b:a?(b||agHm(Math.min(1439,agMin(a)+60))):null,title:$('agEti').value.trim(),cid:cl?cl.id:undefined,adr:$('agEadr').value.trim(),note:$('agEno').value.trim(),rr,who:who.length?who:undefined,ch:$('agEch').value||undefined,at:Date.now()});
 if(!rr){delete e.rr;delete e.ex}agRemCompute(e);
 if(!agEd)db.events.push(e);save();agShClose();agSel=d;agRender();
 const ck=agCheck(e);toast(i18nT(ck.hors?'Enregistré, en dehors de tes créneaux de travail.':ck.over.length?'Enregistré : chevauche un autre rendez-vous.':'Enregistré.'));
 if(isNew)setTimeout(()=>agNotify(cl,e),300)}
function agDel(){if(!agEd||!confirm(i18nT(agEd.rr?'Supprimer toute la répétition ?':'Supprimer ce rendez-vous ?')))return;db.events=db.events.filter(e=>e!==agEd);save();agShClose();agRender()}
function agDelOne(){if(!agEd||!agEd.rr)return;const d=agEdDay||agNextOcc(agEd);agEd.ex=(agEd.ex||[]).concat(d);agEd.at=Date.now();agRemCompute(agEd);save();agShClose();agRender();toast(i18nT('Supprimé pour ce jour-là.'))}
function agEdQuote(){if(agEd&&agEd.cid){agShClose();agQuote(agEd.cid,agEd.id)}}
function agEdPt(){if(!agEd)return;agShClose();go('pt');setTimeout(()=>agPtGo(agEd.id),60)}
// export vers l'agenda du téléphone (.ics)
function agIcs(){
 const e=agEd;if(!e)return;if(e.rr){agIcsFile(agIcsText([[e,agEdDay||agNextOcc(e)||e.d]]),'rdv.ics');return}const st=(d,t)=>d.replace(/-/g,'')+(t?'T'+t.replace(':','')+'00':''),cl=e.cid&&db.clients.find(c=>c.id===e.cid);
 const esc2=s=>String(s||'').replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n');
 const end=e.a?st(e.d,e.b||agHm(agMin(e.a)+60)):st(agAdd(e.d2||e.d,1));
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//caso//planning//FR','BEGIN:VEVENT','UID:'+e.id+'@caso','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',
  (e.a?'DTSTART:':'DTSTART;VALUE=DATE:')+st(e.d,e.a),(e.a?'DTEND:':'DTEND;VALUE=DATE:')+end,'SUMMARY:'+esc2((e.title||'Rendez-vous')+(cl?' – '+cl.nom:'')),e.adr?'LOCATION:'+esc2(e.adr):'',e.note?'DESCRIPTION:'+esc2(e.note):'','END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n');
 const blob=new Blob([ics],{type:'text/calendar'}),f='rdv-'+e.d+'.ics';
 try{const file=new File([blob],f,{type:'text/calendar'});if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file]}).catch(()=>{});return}}catch(_){}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=f;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}

/* ---- 8. créneaux libres : « trouve-moi 3h cette semaine », « suis-je libre jeudi à 14h ? » ---- */
function agBusy(d){return agDayEvents(d).filter(e=>e.t==='rdv'&&e.a).map(e=>[agMin(e.a),e.b?agMin(e.b):agMin(e.a)+60])}
function agGaps(d,dur){
 let F=agFreeRanges(d);if(!agHours())F=[[480,1080]];
 if(d===agToday()){const n=new Date(),m=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;F=F.map(([a,b])=>[Math.max(a,m),b]).filter(([a,b])=>b>a)}
 agBusy(d).forEach(([a,b])=>{F=F.flatMap(([x,y])=>{const o=[];if(a>x)o.push([x,Math.min(y,a)]);if(b<y)o.push([Math.max(x,b),y]);return o.filter(([p,q])=>q>p)})});
 return F.filter(([a,b])=>b-a>=dur)}
function agBook(d,a,b,cnom){agEdit(null,d);$('agEd').value=d;$('agEa').value=a;$('agEb').value=b;$('agEall').checked=false;if(cnom)$('agEcl').value=cnom;agEdAll();setTimeout(()=>$('agEti').focus(),250)}
function agFindUI(){const dur=+$('agFdur').value,ws=agWeekStart(agSel);let d0=ws<agToday()?agToday():ws;const d1=agAdd(ws,6),S=[];
 for(let d=d0;d<=d1;d=agAdd(d,1))agGaps(d,dur).slice(0,2).forEach(([a,b])=>S.push({d,a,b}));
 const lc=I18N.lang==='fr'?'fr-FR':I18N.lang;
 $('agFres').innerHTML=S.length?S.slice(0,8).map(x=>`<button class="ag-slot" onclick="agBook('${x.d}','${agHm(x.a)}','${agHm(Math.min(1439,x.a+dur))}')"><b data-noi18n>${esc(agDate(x.d).toLocaleDateString(lc,{weekday:'short',day:'numeric'}))}</b><span data-noi18n>${esc(agH(agHm(x.a))+'–'+agH(agHm(Math.min(1439,x.a+dur))))}</span></button>`).join(''):`<p class="mut">Aucun créneau libre assez long cette semaine.</p>`}

/* ---- 9. rappels : la veille à 18h et 1 h avant ---- */
const agTs=(d,t)=>{const x=agDate(d),[h,m]=(t||'08:00').split(':').map(Number);x.setHours(h,m,0,0);return x.getTime()};
function agRemPrefs(){const d=agDispo();return Object.assign({v:true,h:true},d&&d.rem||{})}
function agRemCompute(e){
 if(!e||e.t!=='rdv'){if(e)delete e.rem;return}
 const P=agRemPrefs(),out=[],td=agToday(),now=Date.now();
 for(let k=-1;k<15;k++){const d=agAdd(td,k);if(!agOccurs(e,d))continue;
  if(P.v)out.push([agTs(agAdd(d,-1),'18:00'),'v',d]);
  if(P.h&&e.a)out.push([agTs(d,e.a)-3600000,'h',d]);
  if(!e.rr&&!e.d2)break}
 const R=out.filter(r=>r[0]>now-6*3600e3).slice(0,8);if(R.length)e.rem=R;else delete e.rem;
 e.tz=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch(_){return undefined}})()}
function agRemRefresh(){let ch=false;db.events.forEach(e=>{if(e.t!=='rdv')return;const b=JSON.stringify([e.rem||[],e.tz]);agRemCompute(e);if(JSON.stringify([e.rem||[],e.tz])!==b)ch=true});if(ch)save()}
function agRemSet(k,v){let dp=agDispo();if(!dp){dp={id:'dispo',t:'dispo',w:[]};db.events.push(dp)}dp.rem=Object.assign(agRemPrefs(),{[k]:v});agRemRefresh();save();agRender()}
function agBanner(icon,title,sub,btn,ms){
 let b=$('agBan');if(!b){b=document.createElement('div');b.id='agBan';b.className='ag-ban';b.setAttribute('role','status');document.body.appendChild(b)}
 b.innerHTML=`<span class="ag-ban-i"><svg class="i"><use href="#i-${icon}"/></svg></span><div class="ag-ban-t"><b data-noi18n>${esc(title)}</b><span data-noi18n>${esc(sub)}</span></div>${btn||''}<button class="ag-ban-x" onclick="agBanClose()" aria-label="Fermer"><svg class="i i-sm"><use href="#i-x"/></svg></button>`;
 b.hidden=false;requestAnimationFrame(()=>b.classList.add('on'));clearTimeout(b._t);b._t=setTimeout(agBanClose,ms||9000)}
function agRemShow(e,k,d){
 const cl=e.cid&&db.clients.find(c=>c.id===e.cid),tt=e.title||i18nT('Rendez-vous');
 const ttl=k==='v'?i18nT('Demain'):i18nT('Dans 1 heure'),sub=[e.a?agH(e.a):'',tt,cl&&cl.nom,e.adr].filter(Boolean).join(' · ');
 agBanner('clock',ttl,sub,`<button class="btn sm" onclick="agBanClose();agOpen('${d}')" data-noi18n>${esc(i18nT('Voir dans Mon planning'))}</button>`,20000);
 try{if(document.hidden&&!notifOn()&&window.Notification&&Notification.permission==='granted')new Notification(ttl,{body:sub,tag:'rem-'+e.id+'-'+k+'-'+d})}catch(_){}}
function agRemTick(){
 const now=Date.now();let S={};try{S=JSON.parse(localStorage.getItem('caso_remshown')||'{}')}catch(_){}
 db.events.forEach(e=>(e.rem||[]).forEach(([t,k,d])=>{const key=e.id+'|'+k+'|'+d;if(t<=now&&now-t<45*60e3&&!S[key]){S[key]=now;agRemShow(e,k,d)}}));
 Object.keys(S).forEach(k=>{if(now-S[k]>4*864e5)delete S[k]});try{localStorage.setItem('caso_remshown',JSON.stringify(S))}catch(_){}}
setTimeout(()=>{try{agRemRefresh();agRemTick()}catch(_){}},2500);
setInterval(()=>{try{agRemTick()}catch(_){}},30000);
setInterval(()=>{try{agRemRefresh()}catch(_){}},3600e3);

/* ---- 10. agenda de l'iPhone : abonnement (avec le serveur) ou export ---- */
async function agIcsSub(){
 const c=getSync();if(!(c.url&&c.token)){agIcsAll();return}
 try{const tz=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch(_){return''}})(),j=await apiTeam('/api/ics',{tz});
  $('agIcsUrl').value=j.url;$('agIcsBox').hidden=false;location.href=j.webcal}catch(e){toast(e.message||i18nT('Erreur.'))}}
function agIcsCopy(){const v=$('agIcsUrl').value;(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(()=>toast(i18nT('Lien copié.')),()=>{$('agIcsUrl').select()})}
function agIcsAll(){
 const td=agToday(),L=[];for(let k=-7;k<120;k++){const d=agAdd(td,k);agDayEvents(d).forEach(e=>{if(!e.d2||d===e.d)L.push([e,d])})}
 const ics=agIcsText(L);agIcsFile(ics,'planning-caso.ics')}
function agIcsText(L){
 const st=(d,t)=>d.replace(/-/g,'')+(t?'T'+t.replace(':','')+'00':''),esc2=s=>String(s||'').replace(/[\\,;]/g,m=>'\\'+m).replace(/\n/g,'\\n'),stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
 const V=L.map(([e,d])=>{const cl=e.cid&&db.clients.find(c=>c.id===e.cid);const end=e.a?st(d,e.b||agHm(agMin(e.a)+60)):st(agAdd(e.d2&&!e.rr?e.d2:d,1));
  return['BEGIN:VEVENT','UID:'+e.id+'-'+d+'@caso','DTSTAMP:'+stamp,(e.a?'DTSTART:':'DTSTART;VALUE=DATE:')+st(d,e.a),(e.a?'DTEND:':'DTEND;VALUE=DATE:')+end,
   'SUMMARY:'+esc2((e.title||i18nT(e.t==='off'?'Indisponible':'Rendez-vous'))+(cl?' – '+cl.nom:'')),e.adr?'LOCATION:'+esc2(e.adr):'',e.note?'DESCRIPTION:'+esc2(e.note):'',e.t==='off'?'TRANSP:OPAQUE':'','END:VEVENT'].filter(Boolean).join('\r\n')});
 return['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//caso//planning//FR','X-WR-CALNAME:casô',...V,'END:VCALENDAR'].join('\r\n')}
function agIcsFile(ics,f){
 const blob=new Blob([ics],{type:'text/calendar'});
 try{const file=new File([blob],f,{type:'text/calendar'});if(navigator.canShare&&navigator.canShare({files:[file]})){navigator.share({files:[file]}).catch(()=>{});return}}catch(_){}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=f;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}

/* ---- 11. équipe et pointage ---- */
function agPtCard(){
 const td=agToday(),E=agDayEvents(td).filter(e=>e.t==='rdv');
 if(!E.length)return'';
 return `<div class="card ag-ptc"><h2><span class="hi"><svg class="i"><use href="#i-cal"/></svg></span>Rendez-vous du jour</h2>`+(E.length?E.map(e=>{const cl=e.cid&&db.clients.find(c=>c.id===e.cid),tm=agTeamTxt(e);
  return `<div class="ag-pt"><div class="ag-pt-t"><b data-noi18n>${esc(e.a?agFmtR(e):i18nT('Toute la journée'))}</b><span data-noi18n dir="auto">${esc(e.title||i18nT('Rendez-vous'))}${cl?' · '+esc(cl.nom):''}</span>${tm?`<span class="mut"><svg class="i i-sm"><use href="#i-users"/></svg> <span data-noi18n>${esc(tm)}</span></span>`:''}</div>${window.CasoAuto&&CasoAuto.active()?'':`<button class="btn sm" onclick="agPtGo('${e.id}')"><svg class="i"><use href="#i-helmet"/></svg>Pointer ici</button>`}</div>`}).join(''):`<p class="mut">Rien de prévu aujourd'hui.</p>`)+`<button class="lnk" onclick="agOpen()">Voir dans Mon planning</button></div>`}
function agChFor(e){
 ensurePt();if(e.ch&&db.chantiers.find(c=>c.id===e.ch))return e.ch;
 const cl=e.cid&&db.clients.find(c=>c.id===e.cid),nm=[cl&&cl.nom,e.adr].filter(Boolean).join(' – ')||e.title||i18nT('Rendez-vous');
 let c=db.chantiers.find(x=>nameKey(x.nom)===nameKey(nm))||(cl&&db.chantiers.find(x=>nameKey(x.nom).includes(nameKey(cl.nom))));
 if(!c){c={id:uid().slice(-6),nom:nm};db.chantiers.push(c)}e.ch=c.id;save();return c.id}
function agPtGo(id){
 const e=db.events.find(x=>x.id===id);if(!e)return;const cid=agChFor(e);renderPt();
 const C=$('ptC'),P=$('ptP');if(C)C.value=cid;if(P&&e.who&&e.who.length)P.value=e.who[0];ptBtn();
 ptPage('go');const k=C&&C.closest('.card');if(k){k.scrollIntoView({behavior:'smooth',block:'center'});k.classList.add('ag-flash');setTimeout(()=>k.classList.remove('ag-flash'),1500)}
 toast(i18nT('Chantier choisi : touche « Entrée / Sortie ».'))}
// une notification de rappel touchée : ouvrir le planning au bon jour
try{if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='agenda'){const m=/agenda=([\d-]{10})/.exec(e.data.url||'');agOpen(m?m[1]:'')}})}catch(_){}
try{const m=/[?&]agenda=([\d-]{10})/.exec(location.search);if(m)setTimeout(()=>{if(!document.body.classList.contains('starting'))agOpen(m[1])},2600)}catch(_){}
