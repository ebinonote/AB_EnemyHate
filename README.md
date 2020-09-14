# AB_EnemyHate

[RPGツクールMV](https://tkool.jp/mv/)のプラグインです。


## どんなプラグイン？

敵がアクターに対しヘイトを持ち、最もヘイトの高いアクターを狙うようになります。
ヘイトはバトル中の行動で変化します。

## プラグインコマンド

- v1.10

ShowHateLine  
ヘイトラインを表示します。  

HideHateLine  
ヘイトラインを非表示にします。  

- v1.13

ShowEnemyHateList  
エネミーリストを表示します。  

HideEnemyHateList  
エネミーリストを非表示にします。  

ShowHateGauge  
ヘイトゲージを表示します。  

HideHateGauge  
ヘイトゲージを非表示にします。  

## 自動的にたまるヘイト


アクターが敵を対象とするスキルやアイテムを使うと、対象から使用者へのヘイトが増加します。  
敵を対象としたヘイトが増加する行動：  
  HP・MPダメージ、デバフ付加、バフ解除、ステート付加  

アクターが味方を対象とするスキルやアイテムを使うと、その味方を狙っている敵から使用者へのヘイトが増加します。  
味方を対象としたヘイトが増加する行動：  
  HP回復、ステート付加、ステートの解除、バフ付加  

プラグインパラメータでどれだけヘイトが増加するか計算式を設定できます。  
計算式では、  

HPダメージ  （対象が敵のときのみ）  ： damage  
MPダメージ  （対象が敵のときのみ）  ： MPDamage  
回復ポイント（対象が味方のときのみ）： healPoint  
スキルの使用者                      ： a, user  
スキルのターゲット                  ： b, target  
ヘイトが増加する敵                  ： enemy  
変数                                ： v  

を使えます。

スキルの使用者、ターゲット、敵、変数はスキルのダメージ計算式と同じように扱うことができます。  
例１：使用者の最大HP  
        user.mhp  
例２：12番目の変数  
        v[12]  

HP・MP吸収攻撃はダメージで増加するヘイトが2倍になります。  


## 「狙われ率」の性質の変化


「特殊能力値 狙われ率」がヘイトの増加のしやすさになり、増加するヘイトに掛けられます。これにより、自分へのヘイトが増加しやすい装備を作ったり、ステートを作ったりすることができます。  

## ヘイトライン

サイドビューでプラグインパラメータDisplayHateLineを1にするとヘイトラインを表示することができます。表示する場合、img/systemフォルダに"hateline.png" を入れてください。この画像が縦に引き伸ばされて表示されます。  

![ヘイトラインの画像](hateline.png)

## ステートごとのヘイト増加式

ステートのメモ：  
  &lt;HATE_formula: 式&gt;  
    このタグで味方や敵にステートを付加したとき、解除したときのヘイト増加式を設定できます。  

    例えば、デフォルトでは防御しただけで、自分を狙う敵からプラグインパラメータで設定した分だけヘイトされますが、防御のステートのメモに  
    &lt;HATE_formula:0&gt;  
    と記述するとヘイトが増加しないようにできます。  

  &lt;HATE_remove_formula: 式&gt;  
    このタグで味方からこのステートを解除したときのヘイト増加式を設定できます。付加したときと解除したときでヘイト増加式を変えたいときに使ってください。  

  &lt;HATE_property: 性質&gt;  
    デフォルトでは、敵にいいステートをかけたときや、味方に悪いステートをかけた時もヘイトが増加しますが、このタグでステートの性質を設定するとスキルの対象によって増加させないこともできるようになります。  
    
###    性質の部分に置き換えられるもの：
    
    good    : 味方にこのステートを付加したときだけヘイトが増加します。  
    neutral : ヘイトは増加しません。  
    bad     : 敵にこのステートを付加したときと、  
               味方のこのステートを解除したときだけヘイトが増加します。  

## ヘイトをコントロールするスキル、アイテム

ヘイトを増減するスキルやアイテムを作ることができます。  

スキル、アイテムのメモ：  
  &lt;HATE_control: 誰が, 誰を, 式&gt;  
  
###   「誰が」の部分に設定できる文字列:
    
    user          : スキルの使用者が敵の場合、使用者がヘイトします。  
    target        : スキルの対象が敵の場合、対象がヘイトします。  
    whoHateUser   : スキルの使用者がアクターの場合、使用者を狙う敵がヘイトします。  
    whoHateTarget : スキルの対象がアクターの場合、そのアクターを狙う敵がヘイトします。  
    all           : 敵全員がヘイトします。範囲が敵全員のスキルには上記targetを指定してください。ヘイト計算はスキルの効果が発動するたびに行われるためです。  
    exceptUser    : スキルの使用者が敵の場合、使用者以外がヘイトします。  
    exceptTarget  : スキルの対象が敵の場合、対象以外がヘイトします。  
    
###   「誰を」の部分に設定できる文字列

    user          : スキルの使用者がアクターの場合、使用者がヘイトされます。  
    target        : スキルの対象がアクターの場合、対象がヘイトされます。  
    exceptUser    : スキルの使用者がアクターの場合、使用者以外がヘイトされます。  
    targetsTarget : スキルの対象が敵の場合、その敵が狙っているアクターがヘイトされます。  
                    

    計算式では、上記のプラグインパラメータで使えるもののほかに
    
    ヘイトされるアクター ： actor  
      
    を使えます。  
    計算の結果負の数になるとヘイトが減少します。  
    このタグは同じスキルに複数設定できます。  
    1回目のタグで敵が狙うアクターが変わると2回目のwhoHateUser, whoHateTargetの結果が変わるので、注意が必要です。  

例：
「挑発」  
範囲が敵単体のスキルで、対象から自分へのヘイトを敵の攻撃力 × 12 増加させる  
&lt;HATE_control:target, user, enemy.atk * 12&gt;  

「隠れる」  
範囲が使用者のスキルで、敵全員の自分へのヘイトを自分の敏捷性 × 4 減少させる  
&lt;HATE_control:all, user, actor.agi * -4&gt;  
  
「かばう」  
範囲が味方単体のスキルで、味方を狙う敵から使用者へのヘイトを使用者の最大HPの半分増加させ、敵全員から味方へのヘイトを使用者の最大HPの4分の1減少させる  
&lt;HATE_control:whoHateTarget, user, user.mhp / 2&gt;  
&lt;HATE_control:all, target, -user.mhp / 4&gt;  

「集中攻撃の号令」（敵専用）  
範囲が敵単体のスキルで、敵全員の対象へのヘイトを50増加させる  
&lt;HATE_control: all, target, 50&gt;  

「注目の笛」（アイテム）  
範囲が味方単体のアイテムで、敵全員の味方へのヘイトを使用者の魔法攻撃力 × 8増加させる  
&lt;HATE_control: all, target, user.mat * 8&gt;  

## ヘイトが溜まらないスキル、アイテム  

スキル、アイテムのメモ：  
  &lt;HATE_no&gt;  
    このタグをつけるとダメージなどでヘイトが増加しないスキルが作れます。前述のヘイトを増減させるタグは無効化しません。  


## ヘイトが溜まらなくなるエネミーのステート - v1.03

例えば、「睡眠」など、状況が把握できなくなるステートにかかったとき、状況が把握できないはずなのにヘイトが溜まってしまうのはおかしく感じられます。  

ステートのメモ：  
  &lt;HATE_cantHate&gt;  
    このタグをつけると、このステートにかかったエネミーのヘイトが変動しなくなります。  


## ヘイトの確認方法

プラグインパラメータ DebugMode を ON にするとどれだけヘイトが増加したか、F8キーで起動する Developer Tools の Console に出力されます。  

また、 DebugMode を ON にするとプラグインパラメータのヘイト増加式にエラーがあった場合も Console に出力されます。  

増加したヘイトはこれで確認できますが、溜まっているヘイトを確認するには少し難しい操作が必要です。  

溜まっているヘイトはGame_Enemyの_hatesという配列に入っていて、添え字はアクターのIDになっています。  

現在溜まっているヘイトを確認するには Developer Toolsの Sources タブを開き、右上の Watch Expressions の＋を押して
$gameTroopと打ちます。$gameTroopの左の右向き三角を押すと中身が見れるので、_enemiesを探します。  
（たぶん1番上にあると思います）    
_enemiesの中身を開くと敵の数だけ番号がありますがこれがエネミーのオブジェクトです。これを開き_hatesを探し、開いてみてください。左の紫色の数字が、アクターのIDで、右の青の文字が現在溜まっているヘイトです。  

## 攻撃者以外へのヘイト減少 - v1.06  

長期戦になると、ヘイトの差が開き、追いつけないものになってしまうことがあります。そこで、アクターがヘイトを稼いだとき、他のアクターへのヘイトが減少する機能を追加しました。以下のプラグインパラメータで設定ができます。  

 ReduceOthersHate  
  この機能を使うかどうかを設定します。デフォルトではOFFになっています。  

OthersHateRateFormula  
   この式の計算結果が現在のヘイトに掛けられます。  
  計算式では、  
  
  増加したヘイト           ： point  
  敵キャラ                 ： enemy  
  ヘイトが減少するアクター ： actor  

  を使えます。  

例：  
デフォルトの場合  
(100 - (point / enemy.atk)) / 100  

攻撃者が敵キャラの攻撃力の4倍のヘイトを稼いだとき、  
(100 - 4) / 100 = 0.96  
攻撃者以外へのヘイトの現在値が0.96倍になる。  

攻撃者が敵キャラの攻撃力の15倍のヘイトを稼いだとき、  
(100 - 15) / 100 = 0.85   
攻撃者以外へのヘイトの現在値が0.85倍になる。  

DebugMode を ON にしていれば、攻撃者以外のヘイトの現在値が表示されます。  

## ヘイト2番目以下のキャラへの攻撃 - v1.09  

スキルのメモ欄：  
  &lt;HATE_target: x&gt;  
    ヘイトがx番目のキャラクターに攻撃します。  
  例：  
  &lt;HATE_target: 3&gt;  
    ヘイトが3番目に高いキャラクターに攻撃します。2人しかいなかった場合2番目のキャラクターが攻撃されます。  


## 敵リスト、パーティリスト - v1.13

○敵リスト  
  選択中のアクターに対する敵全員のヘイトを見られるウィンドウ。  

◆表示されるもの  
・選択中アクターの名前  
・敵全員の  
  ・名前  
  ・選択中アクターのヘイト順位（ヘイトアイコン）  
  ・選択中アクターのゲージ  
  
○ヘイトゲージ  
  選択中、行動中の敵キャラのアクター全員へのヘイトを見られるウィンドウ。  

◆表示されるもの  
・選択中敵キャラの名前  
・アクター全員の  
  ・名前  
  ・そのアクターのヘイト順位（ヘイトアイコン）  
  ・そのアクターのゲージ  
 
プラグインパラメータで各種設定ができます。  
プラグインコマンドでONとOFFの切り替えができます。  
 （上記プラグインコマンド参照）  
 
## YEP_BattleAICore.jsの機能拡張

YEP_BattleAICore.jsはYanfly氏が作成した、敵に賢い行動パターンを設定できるプラグインです。AB_EnemyHate.jsはヘイト関係の機能を追加しました。 この機能を利用するにはプラグインマネージャでYEP_BattleAICore.jsの下にAB_EnemyHate.jsを置いてください。  

追加したCondition:  
HATE ELEMENT X case  
HATE stat PARAM eval  
HATE STATE === state name  
HATE STATE !== state name  

もともとYEP_BattleAICore.jsにあったものの先頭に"HATE "を足しただけです。先頭に"HATE "をつけると最もヘイトの高いアクターの状態を見るようになります。これらのConditionはターゲットを絞り込みません。  

追加したTargeting:  
HATE  
  
Conditionで絞り込まれたアクターの中で最もヘイトが高いアクターを狙います。  

例：  
最もヘイトの高いアクターがPoison状態ならそのアクターにAttackをし、そうでなければそのアクターにPoisonをする  
&lt;AI Priority&gt;  
HATE State === Poison: Attack, HATE  
Always: Poison, HATE  
&lt;/AI Priority&gt;  

最もヘイトの高いアクターがHP70%以下ならDual Attackをし、そうでなければそのアクターにAttackをする  
&lt;AI Priority&gt;  
HATE HP% param &lt;= 70%: Dual Attack, HATE  
Always: Attack, HATE  
&lt;/AI Priority&gt;  

## 更新履歴  

### Version 1.17
  敵リストを非表示にできなくなっていた不具合を修正しました。

### Version 1.16
  ヘイトゲージと敵リストを戦闘中にON、OFFにできるように修正しました。 
  敗北時、逃走時もヘイトゲージを非表示にするように変更しました。

### Version 1.15  
  攻撃時、エラーが出てゲームが停止してしまう不具合を修正しました。  

### Version 1.14  
ヘイトラインをONにしてもヘイトラインが表示されない不具合を修正しました。
戦闘中に敵キャラを攻撃対象にした時に対象にした敵のヘイトゲージが表示されるよ
うにしました。
戦闘終了時、ヘイトゲージが非表示になるようにしました。
ヘイトゲージの敵キャラ名を非表示にできるようにしました。
敵キャラクターを選択した時以外非表示にしました。  

### Version 1.13  
 パーティリストと敵リストを作りました。  
  

### Version 1.12  
  ヘイトがマイナスの値のとき、ゲームが止まってしまうことがあるバグを修正しま
  した。  

### Version 1.11  
  フロントビューでYEP_BattleStatusWindowを使っているとき、ステータス画面に向
  けてラインを伸ばすようにしました。  

### Version 1.10  
  ヘイトラインを表示・非表示するプラグインコマンドを実装しました。  

### Version 1.09  
  ヘイトがX番目に高いアクターを狙うスキルのタグ&lt;HATE_target: x&gt;を追加しまし
  た。  

### Version 1.08  
  ヘイト値が同じとき、先頭に近いアクターが狙われるようにしました。
  ヘイトコントロールの「誰が」に「exceptUser」「exceptTarget」、
  「誰を」に「exceptUser」「targetsTarget」を追加しました。  

### Version 1.07  
  ヘイトラインの表示がおかしくなることがあったので修正しました。
  フロントビューでもDisplayHatelineがONになっていればヘイトラインを表示する
  ようにしました。  

### Version 1.06  
  攻撃者以外へのヘイト減少機能を追加しました。
  エラー表示を見やすくしました。  

### Version 1.05  
  RPGツクールMVのバージョン 1.1.0 で追加された「未使用ファイルを含まない」
  でデプロイメントしたとき、hateline.png が含まれるように変更しました。  

### Version 1.04  
  復活したエネミーのヘイトラインも表示されるように変更しました。  

### Version 1.03
  ステートのメモタグ&lt;HATE_cantHate&gt;を追加しました。

### Version 1.02
  YEP_BattleEnginCore.js と一緒に動作させたときヘイトラインがチカチカする
  問題を修正

### Version 1.01
  パーティにいないメンバーを後から加えた時にうまく動作しないバグを修正
  ※この修正後も、パーティにいないメンバーを加えるときはあらかじめそのメンバ
    ーを全回復するなどして$gameActorsに登録する必要があります。
 
### Version 1.00
  公開

## 利用規約

MITライセンスです。

・クレジット表記は不要  
・営利目的で使用可  
・改変可  
    ただし、ソースコードのヘッダのライセンス表示は残してください。  
・素材だけの再配布も可  
・アダルトゲーム、残酷なゲームでの使用も可  

## License
MIT
