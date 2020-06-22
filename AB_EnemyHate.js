// =============================================================================
// AB_EnemyHate.js
// Version: 1.08
// -----------------------------------------------------------------------------
// Copyright (c) 2015 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc 敵が最もヘイトの高いアクターを狙います。
 * ヘイトはバトル中の行動で変化します。
 * @author ヱビ
 *
 * @requiredAssets img/system/hateline
 * 
 * @param DisplayHateLine
 * @desc ヘイトラインを表示するかどうかを決めます。
 * 0:非表示、1:表示
 * @default 0
 * 
 * @param DebugMode
 * @desc ONにするとヘイトが何ポイント増加したかをコンソールに出力しま
 * す。 0:OFF、1:ON
 * @default 0
 * 
 * @param DamageHateFormula
 * @desc ダメージを与えたとき増加するヘイトの式です。
 * デフォルト： damage
 * @default damage
 * 
 * @param MPDamageHateFormula
 * @desc MPダメージを与えたとき増加するヘイトの式です。
 * デフォルト： MPDamage * 5
 * @default MPDamage * 5
 * 
 * @param HealHateFormula
 * @desc 味方を回復したとき増加するヘイトの式です。
 * デフォルト： healPoint * 2
 * @default healPoint * 2
 * 
 * @param BuffHateFormula
 * @desc 味方にバフを付加したとき増加するヘイトの式です。
 * デフォルト： enemy.atk * 4
 * @default enemy.atk * 4
 * 
 * @param DebuffHateFormula
 * @desc 敵にデバフを付加したとき増加するヘイトの式です。
 * デフォルト： enemy.atk * 4
 * @default enemy.atk * 4
 * 
 * @param StateToEnemyHateFormula
 * @desc 敵にステートを付加した時増加するヘイトの式です。
 * デフォルト： enemy.atk * 4
 * @default enemy.atk * 4
 * 
 * @param StateToActorHateFormula
 * @desc 味方にステートを付加した時増加するヘイトの式です。
 * デフォルト： enemy.atk * 4
 * @default enemy.atk * 4
 * 
 * @param RemoveStateHateFormula
 * @desc 味方からステートを取り除いたとき増加するヘイトの式です。
 * デフォルト： enemy.atk * 4
 * @default enemy.atk * 4
 * 
 * @param ReduceOthersHate
 * @desc ヘイトが増える行動をしたとき、味方のヘイトを減らしますか？
 * 減らさない：0, 減らす：1
 * @default 0
 * 
 * @param OthersHateRateFormula
 * @desc 味方のヘイトを減らすときの割合の式です。
 * デフォルト： (100 - (point / enemy.atk)) / 100
 * @default (100 - (point / enemy.atk)) / 100
 * 
 * @help
 * ============================================================================
 * どんなプラグイン？
 * ============================================================================
 * 
 * 敵がアクターに対しヘイトを持ち、最もヘイトの高いアクターを狙うようになります。
 * ヘイトはバトル中の行動で変化します。
 * 
 * ============================================================================
 * 自動的にたまるヘイト
 * ============================================================================
 * 
 * アクターが敵を対象とするスキルやアイテムを使うと、対象から使用者へのヘイトが
 * 増加します。
 * 敵を対象としたヘイトが増加する行動：
 *   HP・MPダメージ、デバフ付加、バフ解除、ステート付加
 * 
 * アクターが味方を対象とするスキルやアイテムを使うと、その味方を狙っている敵か
 * ら使用者へのヘイトが増加します。
 * 味方を対象としたヘイトが増加する行動：
 *   HP回復、ステート付加、ステートの解除、バフ付加
 * 
 * プラグインパラメータでどれだけヘイトが増加するか計算式を設定できます。
 * 計算式では、
 * ----------------------------------------------------------------------------
 * HPダメージ  （対象が敵のときのみ）  ： damage
 * MPダメージ  （対象が敵のときのみ）  ： MPDamage
 * 回復ポイント（対象が味方のときのみ）： healPoint
 * スキルの使用者                      ： a, user
 * スキルのターゲット                  ： b, target
 * ヘイトが増加する敵                  ： enemy
 * 変数                                ： v
 * ----------------------------------------------------------------------------
 * を使えます。
 * 
 * スキルの使用者、ターゲット、敵、変数はスキルのダメージ計算式と同じように
 * 扱うことができます。
 * 例１：使用者の最大HP
 *         user.mhp
 * 例２：12番目の変数
 *         v[12]
 * 
 * HP・MP吸収攻撃はダメージで増加するヘイトが2倍になります。
 * 
 * ============================================================================
 * 「狙われ率」の性質の変化
 * ============================================================================
 * 
 * 「特殊能力値 狙われ率」がヘイトの増加のしやすさになり、増加するヘイトに掛けら
 * れます。これにより、自分へのヘイトが増加しやすい装備を作ったり、ステートを作っ
 * たりすることができます。
 * 
 * ============================================================================
 * ヘイトライン
 * ============================================================================
 * 
 * サイドビューでプラグインパラメータDisplayHateLineを1にするとヘイトラインを
 * 表示することができます。表示する場合、img/systemフォルダに
 * "hateline.png" を入れてください。この画像が縦に引き伸ばされて表示されます。
 * 
 * ============================================================================
 * ステートごとのヘイト増加式
 * ============================================================================
 * 
 * ステートのメモ：
 *   <HATE_formula: 式>
 *     このタグで味方や敵にステートを付加したとき、解除したときのヘイト増加式を
 *     設定できます。
 * 
 *     例えば、デフォルトでは防御しただけで、自分を狙う敵からプラグインパラメー
 *     タで設定した分だけヘイトされますが、防御のステートのメモに
 *     <HATE_formula:0>
 *     と記述するとヘイトが増加しないようにできます。
 * 
 *   <HATE_remove_formula: 式>
 *     このタグで味方からこのステートを解除したときのヘイト増加式を設定できます。
 *     付加したときと解除したときでヘイト増加式を変えたいときに使ってください。
 * 
 *   <HATE_property: 性質>
 *     デフォルトでは、敵にいいステートをかけたときや、味方に悪いステートをかけ
 *     た時もヘイトが増加しますが、このタグでステートの性質を設定するとスキルの
 *     対象によって増加させないこともできるようになります。
 * 
 *     ========================================================================
 *     性質の部分に置き換えられるもの：
 *     ------------------------------------------------------------------------
 *     good    : 味方にこのステートを付加したときだけヘイトが増加します。
 *     neutral : ヘイトは増加しません。
 *     bad     : 敵にこのステートを付加したときと、
 *               味方のこのステートを解除したときだけヘイトが増加します。
 *     ========================================================================
 * 
 * ============================================================================
 * ヘイトをコントロールするスキル、アイテム
 * ============================================================================
 * 
 * ヘイトを増減するスキルやアイテムを作ることができます。
 * 
 * スキル、アイテムのメモ：
 *   <HATE_control: 誰が, 誰を, 式>
 *     ========================================================================
 *    「誰が」の部分に設定できる文字列:
 *     ------------------------------------------------------------------------
 *     user          : スキルの使用者が敵の場合、使用者がヘイトします。
 *     target        : スキルの対象が敵の場合、対象がヘイトします。
 *     whoHateUser   : スキルの使用者がアクターの場合、使用者を狙う敵がヘイトし
 *                     ます。
 *     whoHateTarget : スキルの対象がアクターの場合、そのアクターを狙う敵がヘイ
 *                     トします。
 *     all           : 敵全員がヘイトします。
 *                     範囲が敵全員のスキルには上記targetを指定してください。
 *                     ヘイト計算はスキルの効果が発動するたびに行われるためです。
 *     exceptUser    : スキルの使用者が敵の場合、使用者以外がヘイトします。
 *     exceptTarget  : スキルの対象が敵の場合、対象以外がヘイトします。
 *     ========================================================================
 * 
 *     ========================================================================
 *    「誰を」の部分に設定できる文字列
 *     ------------------------------------------------------------------------
 *     user          : スキルの使用者がアクターの場合、使用者がヘイトされます。
 *     target        : スキルの対象がアクターの場合、対象がヘイトされます。
 *     exceptUser    : スキルの使用者がアクターの場合、使用者以外がヘイトされま
 *                     す。
 *     targetsTarget : スキルの対象が敵の場合、その敵が狙っているアクターがヘイ
 *                     トされます。
 *     ========================================================================
 * 
 *     計算式では、上記のプラグインパラメータで使えるもののほかに
 *     ------------------------------------------------------------------------
 *     ヘイトされるアクター ： actor
 *     ------------------------------------------------------------------------
 *     を使えます。
 *     計算の結果負の数になるとヘイトが減少します。
 *     このタグは同じスキルに複数設定できます。
 *     1回目のタグで敵が狙うアクターが変わると2回目のwhoHateUser, whoHateTarget
 *     の結果が変わるので、注意が必要です。
 * 
 * --- 例 ---
 * 「挑発」
 * 範囲が敵単体のスキルで、対象から自分へのヘイトを敵の攻撃力 × 12 増加させる
 * <HATE_control:target, user, enemy.atk * 12>
 * 
 * 「隠れる」
 * 範囲が使用者のスキルで、敵全員の自分へのヘイトを自分の敏捷性 × 4 減少させる
 * <HATE_control:all, user, actor.agi * -4>
 * 
 * 「かばう」
 * 範囲が味方単体のスキルで、
 * 味方を狙う敵から使用者へのヘイトを使用者の最大HPの半分増加させ、
 * 敵全員から味方へのヘイトを使用者の最大HPの4分の1減少させる
 * <HATE_control:whoHateTarget, user, user.mhp / 2>
 * <HATE_control:all, target, -user.mhp / 4>
 * 
 * 「集中攻撃の号令」（敵専用）
 * 範囲が敵単体のスキルで、敵全員の対象へのヘイトを50増加させる
 * <HATE_control: all, target, 50>
 * 
 * 「注目の笛」（アイテム）
 * 範囲が味方単体のアイテムで、敵全員の味方へのヘイトを使用者の魔法攻撃力 × 8
 * 増加させる
 * <HATE_control: all, target, user.mat * 8>
 * 
 * ============================================================================
 * ヘイトが溜まらないスキル、アイテム
 * ============================================================================
 * 
 * スキル、アイテムのメモ：
 *   <HATE_no>
 *     このタグをつけるとダメージなどでヘイトが増加しないスキルが作れます。
 *     前述のヘイトを増減させるタグは無効化しません。
 * 
 * ============================================================================
 * ヘイトが溜まらなくなるエネミーのステート
 * ============================================================================
 * 
 * 例えば、「睡眠」など、状況が把握できなくなるステートにかかったとき、状況が
 * 把握できないはずなのにヘイトが溜まってしまうのはおかしく感じられます。
 * 
 * ステートのメモ：
 *   <HATE_cantHate>
 *     このタグをつけると、このステートにかかったエネミーのヘイトが変動しなく
 *     なります。
 * 
 * ============================================================================
 * ヘイトの確認方法
 * ============================================================================
 * 
 * プラグインパラメータ DebugMode を ON にするとどれだけヘイトが増加したか、
 * F8キーで起動する Developer Tools の Console に出力されます。
 * 
 * また、 DebugMode を ON にするとプラグインパラメータのヘイト増加式にエラーが
 * あった場合も Console に出力されます。
 * 
 * 増加したヘイトはこれで確認できますが、溜まっているヘイトを確認するには
 * 少し難しい操作が必要です。
 * 
 * 溜まっているヘイトはGame_Enemyの_hatesという配列に入っていて、添え字は
 * アクターのIDになっています。
 * 
 * 現在溜まっているヘイトを確認するには
 * Developer Toolsの Sources タブを開き、右上の Watch Expressions の＋を押して
 * $gameTroopと打ちます。
 * $gameTroopの左の右向き三角を押すと中身が見れるので、_enemiesを探します。
 * （たぶん1番上にあると思います）
 * _enemiesの中身を開くと敵の数だけ番号がありますがこれがエネミーのオブジェクト
 * です。これを開き_hatesを探し、開いてみてください。左の紫色の数字が、アクター
 * のIDで、右の青の文字が現在溜まっているヘイトです。
 * 
 * ============================================================================
 * 攻撃者以外へのヘイト減少
 * ============================================================================
 * 
 * 長期戦になると、ヘイトの差が開き、追いつけないものになってしまうことがありま
 * す。そこで、アクターがヘイトを稼いだとき、他のアクターへのヘイトが減少する
 * 機能を追加しました。以下のプラグインパラメータで設定ができます。
 * 
 * ReduceOthersHate
 *   この機能を使うかどうかを設定します。デフォルトではOFFになっています。
 * 
 * OthersHateRateFormula
 *   この式の計算結果が現在のヘイトに掛けられます。
 *   計算式では、
 *   --------------------------------------------------------------------------
 *   増加したヘイト           ： point
 *   敵キャラ                 ： enemy
 *   ヘイトが減少するアクター ： actor
 *   --------------------------------------------------------------------------
 *   を使えます。
 * 
 * ---例---
 * デフォルトの場合
 * (100 - (point / enemy.atk)) / 100
 * 
 * 攻撃者が敵キャラの攻撃力の4倍のヘイトを稼いだとき、
 * (100 - 4) / 100 = 0.96
 * 攻撃者以外へのヘイトの現在値が0.96倍になる。
 * 
 * 攻撃者が敵キャラの攻撃力の15倍のヘイトを稼いだとき、
 * (100 - 15) / 100 = 0.85
 * 攻撃者以外へのヘイトの現在値が0.85倍になる。
 * 
 * DebugMode を ON にしていれば、攻撃者以外のヘイトの現在値が表示されます。
 * 
 * ============================================================================
 * YEP_BattleAICore.jsの機能拡張
 * ============================================================================
 * 
 * YEP_BattleAICore.jsはYanfly氏が作成した、敵に賢い行動パターンを設定できるプラ
 * グインです。AB_EnemyHate.jsはヘイト関係の機能を追加しました。
 * この機能を利用するにはプラグインマネージャでYEP_BattleAICore.jsの下に
 * AB_EnemyHate.jsを置いてください。
 * 
 * 追加したCondition:
 * HATE ELEMENT X case
 * HATE stat PARAM eval
 * HATE STATE === state name
 * HATE STATE !== state name
 * 
 * もともとYEP_BattleAICore.jsにあったものの先頭に"HATE "を足しただけです。
 * 先頭に"HATE "をつけると最もヘイトの高いアクターの状態を見るようになります。
 * これらのConditionはターゲットを絞り込みません。
 * 
 * 追加したTargeting:
 * HATE
 * 
 * Conditionで絞り込まれたアクターの中で最もヘイトが高いアクターを狙います。
 * 
 * --- 例 ---
 * 最もヘイトの高いアクターがPoison状態ならそのアクターにAttackをし、
 * そうでなければそのアクターにPoisonをする
 * <AI Priority>
 * HATE State === Poison: Attack, HATE
 * Always: Poison, HATE
 * </AI Priority>
 * 
 * 最もヘイトの高いアクターがHP70%以下ならDual Attackをし、
 * そうでなければそのアクターにAttackをする
 * <AI Priority>
 * HATE HP% param <= 70%: Dual Attack, HATE
 * Always: Attack, HATE
 * </AI Priority>
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 1.08
 *   ヘイト値が同じとき、先頭に近いアクターが狙われるようにしました。
 *   ヘイトコントロールの「誰が」に「exceptUser」「exceptTarget」、
 *   「誰を」に「exceptUser」「targetsTarget」を追加しました。
 * 
 * Version 1.07
 *   ヘイトラインの表示がおかしくなることがあったので修正しました。
 *   フロントビューでもDisplayHatelineがONになっていればヘイトラインを表示する
 *   ようにしました。
 * 
 * Version 1.06
 *   攻撃者以外へのヘイト減少機能を追加しました。
 *   エラー表示を見やすくしました。
 * 
 * Version 1.05
 *   RPGツクールMVのバージョン 1.1.0 で追加された「未使用ファイルを含まない」
 *   でデプロイメントしたとき、hateline.png が含まれるように変更しました。
 * 
 * Version 1.04
 *   復活したエネミーのヘイトラインも表示されるように変更しました。
 * 
 * Version 1.03
 *   ステートのメモタグ<HATE_cantHate>を追加しました。
 * 
 * Version 1.02
 *   YEP_BattleEnginCore.js と一緒に動作させたときヘイトラインがチカチカする
 *   問題を修正
 * 
 * Version 1.01
 *   パーティにいないメンバーを後から加えた時にうまく動作しないバグを修正
 *   ※この修正後も、パーティにいないメンバーを加えるときはあらかじめそのメンバ
 *     ーを全回復するなどして$gameActorsに登録する必要があります。
 * 
 * Version 1.00
 *   公開
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・改変可
 *     ただし、ソースコードのヘッダのライセンス表示は残してください。
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 * 
 */

(function() {
	var parameters = PluginManager.parameters('AB_EnemyHate');
	var displayHateLine = (parameters['DisplayHateLine'] == 1) ? true : false;
	var HateDebugMode = (parameters['DebugMode'] == 1) ? true : false;
	var DamageHateFormula = (parameters['DamageHateFormula'] || 0);
	var MPDamageHateFormula = (parameters['MPDamageHateFormula'] || 0);
	var HealHateFormula = (parameters['HealHateFormula'] || 0);
	var BuffHateFormula = (parameters['BuffHateFormula'] || 0);
	var DebuffHateFormula = (parameters['DebuffHateFormula'] || 0);
	var StateToEnemyHateFormula = (parameters['StateToEnemyHateFormula'] || 0);
	var StateToActorHateFormula = (parameters['StateToActorHateFormula'] || 0);
	var RemoveStateHateFormula = (parameters['RemoveStateHateFormula'] || 0);
	var ReduceOthersHate = (parameters['ReduceOthersHate'] == 1) ? true : false;
	var OthersHateRateFormula = (parameters['OthersHateRateFormula'] || 0);
//=============================================================================
// Game_Enemy
//=============================================================================
	var Game_Enemy_prototype_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		Game_Enemy_prototype_setup.call(this, enemyId, x, y);
		this._hates = [];
		var allActors = $gameActors._data;
		var enemy = this;
		allActors.forEach(function(actor) {
			if (!actor) return;
			enemy._hates[actor.actorId()] = Math.randomInt(10);
		});
	};

	Game_Enemy.prototype.hates = function() {
		return this._hates;
	};

	Game_Enemy.prototype.hate = function(index, point) {
		this._hates[index] += point;
		if (this._hates[index] < 0) this._hates[index] = 0;
		if (HateDebugMode) {
			console.log(this.name() + "の" + $gameActors.actor(index).name() + "へのヘイトが" + point + "ポイント増加");
		}
		if (point > 0) this.reduceOthersHates(index, point);
	};

	Game_Enemy.prototype.reduceOthersHates = function(index, point) {
		if (!ReduceOthersHate) return;
		var enemy = this;
		var actors = $gameParty.battleMembers();
		actors.forEach(function(actor) {
			if (actor.actorId() == index) return;
			var rate = 1;
			try {
				rate = eval(OthersHateRateFormula);
				if (isNaN(rate)) {
					throw new Error("「" + OthersHateRateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				rate = 1;
			}
			enemy.multiplyHate(actor.actorId(), rate);
		});
	};

	Game_Enemy.prototype.multiplyHate = function(index, rate) {
		if (rate < 0) return;
		var hate = this._hates[index] * rate;
		hate = Math.round(hate);
		this._hates[index] = hate;
		if (HateDebugMode) {
			console.log(this.name() + "の" + $gameActors.actor(index).name() + "へのヘイトが" + hate + "になった");
		}
	};

	Game_Enemy.prototype.hateTarget = function() {
		return $gameParty.hateTarget(this._hates);
	}

	Game_Enemy.prototype.hateTargetOf = function(group) {
		if (typeof this._hates === "undefined") {
			return false;
		}
		var hates = this._hates;
		var max = -1;
		var mainTarget;
		group.forEach(function(member) {
			if (!member.isActor()) return false;
			if (!member.isBattleMember()) return false;
			var i = member.actorId();
			if (max < hates[i]) {
				max = hates[i];
				mainTarget = member;
			}
		});
		return mainTarget;
	}

	Game_Enemy.prototype.canHate = function() {
		return !this._states.some(function(stateId){
			var state = $dataStates[stateId];
			if (!state) return false;
			if (state.meta.HATE_cantHate) return true;
			return false;
		});
	};

//=============================================================================
// Game_Party
//=============================================================================
	
	Game_Party.prototype.hateTarget = function(hates) {
		// 
		var max = -1;
		var mainTarget;
		this.aliveMembers().forEach(function(member) {
			if (!member.isBattleMember()) return;
			var i = member.actorId();
			if (max < hates[i]) {
				max = hates[i];
				mainTarget = member;
			}
		});
		return mainTarget;
	};
	
//=============================================================================
// Game_Actor
//=============================================================================

	Game_Actor.prototype.whoHateMe = function() {
		var who = [];
		var enemies = $gameTroop.aliveMembers();
		for (var i=0,l=enemies.length; i < l; i++) {
			if (enemies[i].hateTarget() == this) {
				who.push(enemies[i]);
			}
		}
		return who;
	}

//=============================================================================
// Game_Action
//=============================================================================

	Game_Action.prototype.targetsForOpponents = function() {
		var targets = [];
		var unit = this.opponentsUnit();
		if (this.isForRandom()) {
			for (var i = 0; i < this.numTargets(); i++) {
				targets.push(unit.randomTarget());
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				if (this._subjectActorId > 0) {
					targets.push(unit.randomTarget());
				} else {
					targets.push(unit.hateTarget(this.subject().hates()));
				}
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	};

	Game_Action.prototype.confusionTarget = function() {
		switch (this.subject().confusionLevel()) {
		case 1:
			if (this._subjectActorId > 0)
				return this.opponentsUnit().randomTarget();
			return this.opponentsUnit().hateTarget(this.subject().hates());
		case 2:
			if (Math.randomInt(2) === 0) {
			return this.opponentsUnit().randomTarget();
			}
			return this.friendsUnit().randomTarget();
		default:
			return this.friendsUnit().randomTarget();
		}
	};

	var Game_Action_prototype_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		Game_Action_prototype_apply.call(this, target);
		this.varyHate(target);
	};

	Game_Action.prototype.varyHate = function(target) {
		if (this._subjectActorId > 0) {
			if (target.isActor()) {
				if (!this._item.object().meta.HATE_no) {
					this.actorToActorVaryHate(target);
				}
			} else {
				if (!this._item.object().meta.HATE_no) {
					this.actorToEnemyVaryHate(target);
				}
			}
		}
		this.controlHate(target);
	};

	Game_Action.prototype.actorToEnemyVaryHate = function(target) {
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var enemy = target;
		var v = $gameVariables._data;
		var hate = 0;

		var damage = Math.max(result.hpDamage, 0);
		var MPDamage = Math.max(result.mpDamage, 0);

		if (!enemy.canHate()) return;

		if (damage) {
			var add = 0;
			try {
				add = eval(DamageHateFormula);

				if (isNaN(add)) {
					throw new Error("「" + DamageHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				add = 0;
			}
			hate += add;
		}

		if (MPDamage) {
			var add = 0;
			try {
				add = eval(MPDamageHateFormula);
				if (isNaN(add)) {
					throw new Error("「" + MPDamageHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				add = 0;
			}
			hate += add;
		}

		if (result.drain) hate = Math.floor(hate * 2);

		var addedStateObjects = result.addedStateObjects();
		addedStateObjects.forEach(function(state) {
			var property = state.meta.HATE_property;
			if (property && (property.match(/good/) || property.match(/neutral/))) return;
			var HATE_formula = state.meta.HATE_formula;
			var add = 0;
			if (HATE_formula) {
				try {
					add = eval(HATE_formula);
					if (isNaN(add)) {
					throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
			} else {
				try {
					add = eval(StateToEnemyHateFormula);
					if (isNaN(add)) {
					throw new Error("「" + StateToEnemyHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
			}
			hate += add;
		});

		if (result.addedDebuffs.length + result.removedBuffs.length > 0) {
			var add = 0;
			try {
				add = eval(DebuffHateFormula);
				if (isNaN(add)) {
					throw new Error("「" + DebuffHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
					add = 0;
				}
			}
			add = (result.addedDebuffs.length + result.removedBuffs.length) * add;
			hate += add;
		}

		hate = Math.ceil(hate * user.tgr);

		target.hate(user.actorId(), hate);
		/*if (HateDebugMode) {
			console.log(target.name() + "の" + user.name() + "へのヘイトが" + hate + "ポイント増加");
		}*/
	
	};



	Game_Action.prototype.actorToActorVaryHate = function(target) {
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var enemies = target.whoHateMe();
		var v = $gameVariables._data;

		var healPoint = Math.max(-result.hpDamage, 0);

		for (var i=0, l=enemies.length; i<l; i++) {
			var hate = 0;
			var enemy = enemies[i];
	
			if (!enemy.canHate()) continue;

			if (healPoint) {
				var add = 0;
				try {
					add = eval(HealHateFormula);
					if (isNaN(add)) {
						throw new Error("「" + HealHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
				hate += add;
			}

			var addedStateObjects = result.addedStateObjects();
			addedStateObjects.forEach(function(state) {
				var property = state.meta.HATE_property;
				if (property && (property.match(/bad/) || property.match(/neutral/))) return;
				var HATE_formula = state.meta.HATE_formula;
				var add = 0;
				if (HATE_formula) {
					try {
						add = eval(HATE_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else {
					try {
						add = eval(StateToActorHateFormula);
						if (isNaN(add)) {
							throw new Error("「" + StateToActorHateFormula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				}
				hate += add;
			});

			var removedStateObjects = result.removedStateObjects();
			removedStateObjects.forEach(function(state) {
				var property = state.meta.HATE_property;
				if (property && (property.match(/good/) || property.match(/neutral/))) return;
				var HATE_formula = state.meta.HATE_formula;
				var HATE_remove_formula = state.meta.HATE_remove_formula;
				var add = 0;
				
				if (HATE_remove_formula) {
					try {
						add = eval(HATE_remove_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_remove_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else if (HATE_formula) {
					try {
						add = eval(HATE_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else {
					try {
						add = eval(RemoveStateHateFormula);
						if (isNaN(add)) {
							throw new Error("「" + RemoveStateHateFormula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				}
				hate += add;
			});

			if (result.addedBuffs.length > 0) {
				var add = 0;
				try {
					add = eval(BuffHateFormula);
					if (isNaN(add)) {
						throw new Error("「" + BuffHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
				add = result.addedBuffs.length * add;
				hate += add;
			}

			hate = Math.ceil(hate * user.tgr);

			enemy.hate(user.actorId(), hate);
			/*if (HateDebugMode) {
				console.log(enemy.name() + "の" + user.name() + "へのヘイトが" + hate + "ポイント増加");
			}*/
		}
	};

	Game_Action.prototype.controlHate = function(target) {
		
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var v = $gameVariables._data;
		var enemies = [];
		var actors = [];
		var hate;
		var action = this;

		var damage = Math.max(result.hpDamage, 0);
		var MPDamage = Math.max(result.mpDamage, 0);

		var hateControls = this._item.object().hateControls;
		for (var i = 0; i < hateControls.length; i++) {
			var HATE_enemy = hateControls[i].enemy;
			var HATE_actor = hateControls[i].actor;
			var HATE_formula = hateControls[i].formula;
			var enemies = this.haterEnemies(target, HATE_enemy);
			var actors = this.hatedActors(target, HATE_actor);
			
			enemies.forEach(function(enemy) {
				if (!enemy.canHate()) return;
				actors.forEach(function(actor) {
					try {
						hate = eval(HATE_formula);
						if (isNaN(hate)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch(e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						hate = 0;
					}
					hate = Math.ceil(hate * actor.tgr);
					if (hate != 0) action.makeSuccess(target);
					enemy.hate(actor.actorId(), hate);
				});
			});
		}
	};

	Game_Action.prototype.haterEnemies = function(target, HATE_enemy) {

		if (HATE_enemy.match(/^user$/i)) {
			return this.enemiesUser(target);

		} else if (HATE_enemy.match(/^target$/i)) {
			return this.enemiesTarget(target);

		} else if (HATE_enemy.match(/^whoHateUser$/i)) {
			return this.enemiesWhoHateUser(target);

		} else if (HATE_enemy.match(/^whoHateTarget$/i)) {
			return this.enemiesWhoHateTarget(target);

		} else if (HATE_enemy.match(/^all$/i)) {
			return $gameTroop.aliveMembers();

		} else if (HATE_enemy.match(/^exceptUser$/i)) {
			return this.enemiesExceptUser(target);

		} else if (HATE_enemy.match(/^exceptTarget$/i)) {
			return this.enemiesExceptTarget(target);

		}
		return [];
	};

	Game_Action.prototype.enemiesUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isEnemy()) enemies.push(user);
		return enemies;
	};

	Game_Action.prototype.enemiesTarget = function(target) {
		var enemies = [];
		if (target.isEnemy()) enemies.push(target);
		return enemies;
	};

	Game_Action.prototype.enemiesWhoHateUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isActor()) {
			enemies = user.whoHateMe();
		}
		return enemies;
	};

	Game_Action.prototype.enemiesWhoHateTarget = function(target) {
		var enemies = [];
		if (target.isActor()) {
			enemies = target.whoHateMe();
		}
		return enemies;
	};

	Game_Action.prototype.enemiesExceptUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isEnemy()) {
			enemies = $gameTroop.aliveMembers().filter(function(enemy) {
				return enemy != user;
			});
		}
		return enemies;
	};

	Game_Action.prototype.enemiesExceptTarget = function(target) {
		var enemies = [];
		if (target.isEnemy()) {
			enemies = $gameTroop.aliveMembers().filter(function(enemy) {
				return enemy != target;
			});
		}
		return enemies;
	};


	Game_Action.prototype.hatedActors = function (target, HATE_actor) {

		if (HATE_actor.match(/^user$/i)) {
			return this.actorsUser(target);

		} else if (HATE_actor.match(/^target$/i)) {
			return this.actorsTarget(target);

		} else if (HATE_actor.match(/^exceptUser$/i)) {
			return this.actorsExceptUser(target);

		} else if (HATE_actor.match(/^targetsTarget$/i)) {
			return this.actorsTargetsTarget(target);

		}
		return [];
	};

	Game_Action.prototype.actorsUser = function(target) {
		var actors = [];
		var user = this.subject();
		if (user.isActor()) {
			actors.push(user);
		}
		return actors;
	};

	Game_Action.prototype.actorsTarget = function(target) {
		var actors = [];
		if (target.isActor()) {
			actors.push(target);
		}
		return actors;
	};

	Game_Action.prototype.actorsExceptUser = function(target) {
		var actors = [];
		var user = this.subject();
		if (user.isActor()) {
			actors = $gameParty.aliveMembers().filter(function(actor) {
				return actor != user;
			});
		}
		return actors;
	};

	Game_Action.prototype.actorsTargetsTarget = function(target) {
		var actors = [];
		if (target.isEnemy()) {
			actors.push(target.hateTarget());
		}
		return actors;
	};


//=============================================================================
// DataManager
//=============================================================================
	var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!DataManager_isDatabaseLoaded.call(this)) return false;
		this.processHateNotetags($dataSkills);
		this.processHateNotetags($dataItems);
		return true;
	};

	DataManager.processHateNotetags = function(group) {
		var note1 = /<HATE_control:[ ]*(user|target|whoHateUser|whoHateTarget|all|exceptUser|exceptTarget)[ ]*,[ ]*(user|target|exceptUser|targetsTarget)[ ]*,[ ]*(.+)[ ]*>/i;
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			obj.hateControls = [];

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];
				if (line.match(note1)) {
					var control = {};
					control.enemy = RegExp.$1;
					control.actor = RegExp.$2;
					control.formula = RegExp.$3;
					obj.hateControls.push(control);
				}
			}
		}
	};

//=============================================================================
// displayHateLine
//=============================================================================
	if(displayHateLine) {
//=============================================================================
// HateLine
//=============================================================================

		HateLine = function() {
			this.initialize.apply(this, arguments);
		};
		HateLine.prototype = Object.create(Sprite_Base.prototype);
		HateLine.prototype.constructer = HateLine;

		HateLine.prototype.initialize = function(enemy, spriteset) {
			Sprite_Base.prototype.initialize.call(this);
			this._enemy = enemy;
			this._spriteset = spriteset;
			this._enemySprite = null;
			this._actorNo = -1;
			this.bitmap = ImageManager.loadSystem("hateline");
			this._ex = 0;
			this._ey = 0;	
			this._ax = 0;
			this._ay = 0;
			this.z = 0;

			this.findEnemySprite();
		};

		HateLine.prototype.findEnemySprite = function() {
			var enemy = this._enemy;
			var enemySprites = this._spriteset._enemySprites;
			for (var i=0,l=enemySprites.length; i < l; i++){
				if (enemySprites[i]._enemy == enemy) {
					this._enemySprite = enemySprites[i];
					break;
				}
			}
		};

		HateLine.prototype.updateBindSprites = function() {
			this.updateBindEnemySprite();
			this.updateBindActorSprite();
		};

		HateLine.prototype.updateBindEnemySprite = function() {
			var sprite = this._enemySprite;
			this._ex = sprite.x;
			this._ey = sprite.y;
		};

		HateLine.prototype.updateBindActorSprite = function() {
			var actor = this._enemy.hateTarget();
			if (actor) {
				this._actorNo = actor.index();
				var sprite = this._spriteset._actorSprites[actor.index()];
				this._ax = sprite.x;
				this._ay = sprite.y;
			}
		};
		HateLine.prototype.updatePosition = function() {
			var dx = this._ex - this._ax;
			var dy = this._ey - this._ay;
			var distance = Math.floor(Math.pow(dx*dx+dy*dy,0.5));

			this.x = this._ax;
			this.y = this._ay;
			this.scale.y = distance / this.height;
			//this.rotation = Math.PI * 3 / 2 + Math.atan(dy/dx);
			this.rotation = Math.atan2(dy,dx) - Math.PI / 2;
		};

		HateLine.prototype.update = function() {
			Sprite_Base.prototype.update.call(this);
			if (this._enemy.isHidden() || this._enemy.isDead()) {
				this.hide();
				return;
			}
			this.show();
			this.updateBindSprites();
			this.updatePosition();
		};
//=============================================================================
// Spriteset_Battle
//=============================================================================
		
		Spriteset_Battle.prototype.createHateLines = function() {
			var enemies = $gameTroop.members();
			var hateLines = [];
			var index = this._battleField.getChildIndex(this._enemySprites[0]);
			for (var i = 0,l = enemies.length; i < l; i++) {
				hateLines[i] = new HateLine(enemies[i], this);
				this._battleField.addChildAt(hateLines[i], index);
			}
			this._hateLines = hateLines;
		};
		
		var Spriteset_Battle_prototype_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
		Spriteset_Battle.prototype.createLowerLayer = function() {
			Spriteset_Battle_prototype_createLowerLayer.call(this);
			/*if ($gameSystem.isSideView())*/ this.createHateLines();
		}
		
	}



	
})();
//=============================================================================
// YEP_BattleAICore.js
//=============================================================================
if ("AIManager" in window) {
	AIManager_passAIConditions = AIManager.passAIConditions;
	AIManager.passAIConditions = function(line) {
		// HATE ELEMENT
		if (line.match(/HATE[ ]ELEMENT(.*)/i)) {
			return this.conditionElementOfHateTarget();
		}
		// HATE PARAM EVAL
		if (line.match(/HATE[ ](.*)[ ]PARAM[ ](.*)/i)) {
			var paramId = this.getParamId(String(RegExp.$1));
			var condition = String(RegExp.$2);
			return this.conditionParamOfHateTargetEval(paramId, condition);
		}
		// HATE STATE === X
		if (line.match(/HATE[ ]STATE[ ]===[ ](.*)/i)) {
			return this.conditionHateStateHas(String(RegExp.$1));
		}
		// HATE STATE !== X
    if (line.match(/HATE[ ]STATE[ ]!==[ ](.*)/i)) {
      return this.conditionHateStateNot(String(RegExp.$1));
    }
		return AIManager_passAIConditions.call(this, line);
	};

	AIManager.conditionElementOfHateTarget = function() {
		var line = this._origCondition;
		if (line.match(/HATE[ ]ELEMENT[ ](\d+)[ ](.*)/i)) {
			var elementId = parseInt(RegExp.$1);
			var type = String(RegExp.$2).toUpperCase();
		} else if (line.match(/HATE[ ]ELEMENT[ ](.*)[ ](.*)/i)) {
			var elementId = Yanfly.ElementIdRef[String(RegExp.$1).toUpperCase()];
			var type = String(RegExp.$2).toUpperCase();
		} else {
			return false;
		}
		var user = this.battler();
		var target = user.hateTarget();
		var flag = this.elementRateMatch(target, elementId, type);
		if (flag)  {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionParamOfHateTargetEval = function(paramId, condition) {
		var action = this.action();
		var item = action.item();
		var user = this.battler();
		var s = $gameSwitches._data;
		var v = $gameVariables._data;
		condition = condition.replace(/(\d+)([%％])/g, function() {
			return this.convertIntegerPercent(parseInt(arguments[1]));
		}.bind(this));
		if (paramId < 0) return false;
		if (paramId >= 0 && paramId <= 7) {
			condition = 'target.param(paramId) ' + condition;
		} else if (paramId === 8) {
			condition = 'target.hp ' + condition;
		} else if (paramId === 9) {
			condition = 'target.mp ' + condition;
		} else if (paramId === 10) {
			condition = 'target.hp / target.mhp ' + condition;
		} else if (paramId === 11) {
			condition = 'target.hp / target.mmp ' + condition;
		} else if (paramId === 12) {
			condition = 'target.level ' + condition;
		}
		var target = user.hateTarget();
		var flag = eval(condition);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionHateStateHas = function(condition) {
		if (condition.match(/HATE[ ]STATE[ ](\d+)/i)) {
			var stateId = parseInt(RegExp.$1);
		} else {
			var stateId = Yanfly.StateIdRef[condition.toUpperCase()];
			if (!stateId) return false;
		}
		if (!$dataStates[stateId]) return false;

		var user = this.battler();
		var target = user.hateTarget();
		var flag = target.hasState(stateId);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionHateStateNot = function(condition) {
		if (condition.match(/HATE[ ]STATE[ ](\d+)/i)) {
			var stateId = parseInt(RegExp.$1);
		} else {
			var stateId = Yanfly.StateIdRef[condition.toUpperCase()];
			if (!stateId) return false;
		}
		if (!$dataStates[stateId]) return false;

		var user = this.battler();
		var target = user.hateTarget();
		var flag = target.notState(stateId);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	var AIManager_setProperTarget = AIManager.setProperTarget;
	
	AIManager.setProperTarget = function(group) {
		var action = this.action();
		var user = this.battler();
		var randomTarget = group[Math.floor(Math.random() * group.length)];
		if (group.length <= 0) return action.setTarget(randomTarget.index());
		var line = this._aiTarget.toUpperCase();
		if (line.match(/HATE/i)) {
			if (action.isForOpponent()) {
				var target = user.hateTargetOf(group);
				if (target) {
					return action.setTarget(target.index());
				}
			}
			return action.setTarget(randomTarget.index());
		}

		return AIManager_setProperTarget.call(this, group);
	}
}